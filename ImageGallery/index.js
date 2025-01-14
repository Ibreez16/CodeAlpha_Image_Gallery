const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn= document.querySelector(".uil-times");
const downloadImgBtn= document.querySelector(".uil-import");

const apiKey = "aIA9JAl6kuTK4mH4lELpxYQLzZVE6edERWoAJF9Lb6D4doX8440h5IUC";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;


const downloadImg = async (imgUrl) => {
    const response = await fetch (imgUrl)
    const file = await response.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
};

const showLightbox = (img, name) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map (img => 
        `<li class="card" onclick = "showLightbox('${img.src.large2x}', '${img.photographer}')">
            <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                        <i class="uil uil-import"></i>
                    </button>
                </div>
        </li>`
    ).join("");
}

const getImages = async (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    const response = await fetch (apiURL, {
        headers: {Authorization: apiKey}
    });
    const data = await response.json();
    generateHTML(data.photos);
    loadMoreBtn.innerText = "Load More";
    loadMoreBtn.classList.remove("disabled");
};

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if (e.target.value == "") return searchTerm = null;
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = " ";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}



getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener ("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener ("click", hideLightBox);
downloadImgBtn.addEventListener ("click", (e) => downloadImg(e.target.dataset.img));