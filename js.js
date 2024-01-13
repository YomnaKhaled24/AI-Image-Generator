const generateForm = document.querySelector(".generate-form");

const images = document.querySelector(".images");
const OPENAI_API_KEY = "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";

function downloadImage(imageUrl) {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "downloaded_image.jpg"; // Specify a filename for the downloaded image
    // document.body.appendChild(a);
    a.click();
    // document.body.removeChild(a);
}

function updateImageCard(imgdataArray)
{
    imgdataArray.forEach((imgObject,index) => {
        const imgContainer = images.querySelectorAll(".image")[index];
        const image = imgContainer.querySelector("img");
        const download = imgContainer.querySelector(".downloadButton");
        console.log(download);


        const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
        image.src = aiGeneratedImage;

        image.onload = () =>{
            imgContainer.classList.remove("loading");

            imgContainer.addEventListener("mouseover", function () {
                download.style.display = 'block';
                image.style.opacity = '.5';
            });
            
            imgContainer.addEventListener("mouseout", function () {
                download.style.display = 'none';
                image.style.opacity = '1';
            });

            download.addEventListener("click", () => downloadImage(aiGeneratedImage));
        }
        
    });

}

async function generateAiImages(description, imgQuantity)
{
    try {
        
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers:{
                "Content-Type": "application/json" ,
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt :description,
                n: parseInt(imgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })

        });
        
        if(!response.ok) throw new Error("Failed to generate AI images. Make sure your API key is valid.");

        const { data } = await response.json();   
        console.log(data);

        updateImageCard([...data]);
    } catch (error) {
        alert("Error:", error.message);
        
    }

}


function handleFormSubmissions(e)
{
    e.preventDefault();
    const description = e.srcElement[0].value;
    const imgQuantity = e.srcElement[1].value;

    console.log(description);
    console.log(imgQuantity);

    const imgloading = Array.from({length:imgQuantity}, ()=>

    `<div class="image loading  col-lg-3 col-md-6 pe-3 mb-5 d-flex justify-content-center align-items-center position-relative ">
    <img class="bg-light" src="img/loader.svg" alt="#">
    <button class="btn btn-primary position-absolute rounded-pill downloadButton">Download</button>

    </div>`

    ).join("");
    
    images.innerHTML = imgloading;

    generateAiImages(description, imgQuantity);
}



document.addEventListener("submit",handleFormSubmissions);