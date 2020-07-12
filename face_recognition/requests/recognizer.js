const cv = require('opencv4nodejs');
const path = require('path');
const fs = require('fs');
const recognizer=(req,res,db)=>{
    const face_cascade = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    const webcam = new cv.VideoCapture(0);
    while(true){

        // The program loops until it has 30 images of the face.
        var count = 1;
while (count < 2) {
    const im = webcam.read()
    const gray = im.bgrToGray();
    const options = {
        minSize: new cv.Size(100, 100),
        scaleFactor: 1.2,
        minNeighbors: 10
    };
    const faces = face_cascade.detectMultiScale(gray, options).objects;
    //cv2.imwrite('abcd' + count.toString() + '.jpg', faces[0])
    if (!faces.length) {
        continue;
    }
    else {
        cv.imwrite('testImage/output' + '.jpg', im)
    }
    
    count += 1
    
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    // detect the face within the grey image.
    const getFaceImage = (grayImage) => {
        const faceRegion = classifier.detectMultiScale(grayImage).objects;
        if (!faceRegion.length) {
            throw new Error('No faces found in the photo');
        }
        return grayImage.getRegion(faceRegion[0]);
    };
    
    const basePath = './Images';
    //name mappings
    //it will read all the folder names of images_db which are names 
    //of people registered with us
    const nameMappings = fs.readdirSync(basePath)

    //all images name stored in this 
    const allFiles = []
    nameMappings.forEach(value => {
        allFiles.push(fs.readdirSync(path.resolve(basePath, value)))
    })
    
    // Reading training images Path 
    const Trainning_imagesPath = []
    nameMappings.map(file => {
        const pa = path.resolve(basePath, file)
        const filename = fs.readdirSync(pa)
        filename.map(value => {
            Trainning_imagesPath.push(path.resolve(pa, value))
        })
    })
    //test images path
    const Test_imagesPath = []
    Test_imagesPath.push(path.resolve('testImage', 'output.jpg'))
    const testImages = Test_imagesPath
    .map(filepath => cv.imread(filepath)).map(image => image.bgrToGray())
    .map(getFaceImage)
        .map(faceImg => faceImg.resize(100, 100));
    const trainImages = Trainning_imagesPath.map(filepath => cv.imread(filepath)).map(image => image.bgrToGray())
    .map(getFaceImage)
        .map(faceImg => faceImg.resize(100, 100));
        
    // map all names of people to images of them, based on filename
    const labels = allFiles.flat()
    .map(file => nameMappings.findIndex(name => file.includes(name)));
    // use local binary patterns histograms algo
    const lbph = new cv.LBPHFaceRecognizer();
    // // train the images
    lbph.train(trainImages, labels);
    // // run the recognizerg
    const runPrediction = (recognizer) => {
        testImages.forEach((image) => {
            //console.log(img);
            const result = recognizer.predict(image);
            confValue = result.confidence;
            imgLabel = nameMappings[result.label]
            res.json({confValue,imgLabel})
            // after detecting the name data is added to sql database with date time name etc

            let sqlquery1="INSERT INTO login_details(name,logintime,logindate,logindetails,email) VALUES(?)"
            // let date=Date.now()
             let today=new Date()
             let time= today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
             let date=today.getDate()+"-"+today.getMonth()+"-"+today.getUTCFullYear();
             let values=[imgLabel,time,date,"Face-Id:Fails - User-Id:Success","xyz@gmail.com"]
             db.query(sqlquery1,[values],(err,res)=>{
                 if(err)
                      console.log(err);
                 else
                     console.log("successfully added logindetails");
             })

            // console.log('Predicted Individual: %s, Confidence Distance: %s', imgLabel, confValue);
        });
    };
    // output results
    console.log('lbph:');
    runPrediction(lbph);
    
    //cv2.imshow('OpenCV', im)
    key = cv.waitKey(10)
    if (key == 27)
    break
    
}

}
}

module.exports={
    recognizer
    
}