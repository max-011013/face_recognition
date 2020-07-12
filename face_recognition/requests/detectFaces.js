const cv2 =require('opencv4nodejs')
const fs = require('fs')

const detectFaces=(req,res)=>{

    const face_cascade = new cv2.CascadeClassifier(cv2.HAAR_FRONTALFACE_ALT2);
    const webcam = new cv2.VideoCapture(0);
    const {name} = req.body;
    // The program loops until it has 30 images of the face.
    var count = 0;
    while (count < 30) {
        const im = webcam.read()
        const gray = im.bgrToGray();
        const options = {
            minSize: new cv2.Size(100, 100),
            scaleFactor: 1.2,
            minNeighbors: 10
        };
        const faces = face_cascade.detectMultiScale(gray, options).objects;
        if (!faces.length) {
            continue;
        }
        else {
            var fs = require('fs');
            const dir = `./Images/${name}`;
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cv2.imwrite(`${dir}/` + name + count.toString() + '.jpg', im)
        }
        count += 1
        cv2.imshow('Detecting Faces', im)
        key = cv2.waitKey(10)
        if (count == 29)
        break;
    }
    res.json("done")
    webcam.release()
    cv2.destroyAllWindows()
    
}
module.exports={
    detectFaces
}