async function startFaceApi(){
    const labeledFaceDescriptors =  await loadModelData()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, .6)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
        detections.forEach( detection => {
            const face = faceMatcher.findBestMatch(detection.descriptor)
            document.querySelector('#person').innerText = `Probably ${face.toString().replace('_', ' ')}`;
          })
    }, 500)

    
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