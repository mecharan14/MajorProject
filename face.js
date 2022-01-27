

let i=0;

async function startFaceApi(){
    // const labeledFaceDescriptors =  await loadModelData()
    // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, .6)
    setInterval(async () => {
        // console.log("Called ", ++i);
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        // .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        // .withFaceDescriptors();
        detections.forEach( detection => {
            // const face = faceMatcher.findBestMatch(detection.descriptor)
            // document.querySelector('#person').innerText = `Probably ${face.toString().replace('_', ' ')}`;
            obj = detection.expressions;
            let age = detection.age
            let gender = detection.gender
            let feeling = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
            document.querySelector("#age").innerText = Math.floor(age)
            document.querySelector("#gender").innerText = gender
            document.querySelector("#feeling").innerText = feeling
          })
    }, 2000)

    
}
async function loadModelData() {
        const model = await faceapi.fetchJson('./face_des.json')
        let labels = []
        let desc = []
        model['labeledDescriptors'].forEach(ld => {
            labels.push(ld.label)
            let temp = []
            ld['descriptors'].forEach(d => {
                temp.push(new Float32Array(d));
            })
            desc.push(temp)
        })
        let lds = []
        for (let i = 0; i < labels.length; i++) {
            lds.push(new faceapi.LabeledFaceDescriptors(labels[i], desc[i]))
        }
        return lds;
}