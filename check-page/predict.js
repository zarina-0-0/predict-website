$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
     let dataURL = reader.result;
     $("#selected-image").removeClass('d-none').attr("src", dataURL);
     $("#prediction-list").empty();
    }
   let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
   });
   let model;
   $(document).ready(async function () {
    $('#progress-bar').show();
    console.log("Loading model...");
    try{
     model = await tf.loadLayersModel('jsdem1/model.json');
      $('#progress-bar').hide();
      $('#image-selector-row').removeClass('d-none')
      $('#predict-button').removeClass('d-none').addClass('d-grid')
     }catch(e){
      $('#progress-bar').hide();
      $('#model-not-loaded').removeClass('d-none').append(e)
    }
    console.log("Model loaded.");
   });
   $("#predict-button").click(async function () {
    const classes = ['Alzheimer','Frontotemporal dementia','Lewy body dementia','None', 'Vascular demetia']
    TARGET_CLASSES = Object.assign({}, classes);
    let image = $('#selected-image').get(0);
    console.log(image)
    // Pre-process the image
    let tensor = tf.browser.fromPixels(image, numChannels = 3)
     .resizeNearestNeighbor([224, 224]) // change the image size here
     .toFloat()
     .div(tf.scalar(255.0))
     .expandDims();
   let predictions = await model.predict(tensor).data();
    console.log(predictions)
    let top5 = Array.from(predictions)
     .map(function (p, i) {
      return {
       probability: p,
       className: TARGET_CLASSES[i] // we are selecting the value from the obj
      };
     })
     .sort((a,b)=> (b.probability - a.probability));
   $("#prediction-list").empty();
    top5.forEach(function (p) {
     $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(2)*100}%</li>`);
    });
   });
