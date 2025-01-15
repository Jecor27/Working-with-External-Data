import * as Carousel from "./Carousel.js";
import axios from "axios.js";
// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
// const API_KEY =
//     "live_4bnjjkMy5puVe4S9xif2XieQlpGPXP7Bw0ZQ0qjdGt4PZWORHK5y41d8a9jtlous";

const API_KEY = "live_dYfTfAwgGIGOEe7nNzvhyqItnG6HM2VTwWLwZQ1TDKyPtGh2MvaU8JOODPk8BbRm";



axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

axios.interceptors.request.use((config) => {
    progressBar.style.width = "0%";
    document.body.style.cursor = "progress";
    console.log("request begins: -------------", config);
    return config;
});



axios.interceptors.response.use(
    (response) => {
        document.body.style.cursor = "default";
        console.log("returning: --------------", response)
        return response;
    },
    (error) => {
        document.body.style.cursor = "default";
        return Promise.reject(error);
    }
);

function updateProgress(e) {
    console.log("ProgressEvent:-----------------", e);
    if (e && e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        console.log("testing: ---------", progressBar.style.width = `${percentage}%`);
    }

}
updateProgress();
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

async function initialLoad() {
    const response = await axios.get("/breeds", {
        onDownloadProgress: updateProgress,
    });


    const data = response.data;
    //console.log(data);

    data.forEach((breed) => {
        const option = document.createElement("option");
        option.value = breed.id; //sets an id for when a breed is chosen
        //from the drop down list
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });
    if (data.length > 0) {
        handleBreedChange({ target: { value: data[0].id } });
    }
    //console.log("Dropdown with breeds.");
}


/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */


breedSelect.addEventListener("change", handleBreedChange);
initialLoad();

async function handleBreedChange(e) {
    const breedId = e.target.value;
    try {
        const response = await axios.get(`/images/search?limit=10&breed_ids=${breedId}`, {
            onDownloadProgress: updateProgress,
        });

        const data = response.data;
        // console.log("breed data received:", data);

        const breedResponse = await axios.get("/breeds");


        const breeds = breedResponse.data;
        const selectedBreed = breeds.find((breed) => breed.id === breedId);
        //console.log("breedinfo: ", selectedBreed);

        Carousel.clear();
        infoDump.innerHTML = "";

        data.forEach((item) => {
            let element = Carousel.createCarouselItem(item.url, "cat image", item.id);
            Carousel.appendCarousel(element);

            //console.log("hello");
        });
        if (selectedBreed) {
            infoDump.innerHTML = `
          <h2>${selectedBreed.name}</h2>
          <p>${selectedBreed.description}</p>
          <p>Want to know more? Check out this links!! -> <a href="${selectedBreed.vetstreet_url}" target="_blank">Vetstreet</a> , 
          <a href="${selectedBreed.vcahospitals_url}" target="_blank">VCA Hospitals</a></p>
          <p><strong>Temperament:</strong> ${selectedBreed.temperament}</p>
          <p><strong>Origin:</strong> ${selectedBreed.origin}</p>
          <p><strong>Life Span:</strong> ${selectedBreed.life_span} years</p>
        `;
        } else {
            infoDump.innerHTML = `
          <h2>No Breed Information Available</h2>
          <p>We could not retrieve information for this breed.</p>
        `;
        }
        Carousel.start();
    } catch (error) {
        console.error("Error fetching breed data:", error);
    }
}

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/* axios.interceptors.request.use((config) => {
    progressBar.style.width = "0%";
    document.body.style.cursor = "progress";
    console.log("request begins: ", config);
    return config;
});



axios.interceptors.response.use(
    (response) => {
        document.body.style.cursor = "default";
        console.log("returning: ", response)
        return response;
    },
    (error) => {
        document.body.style.cursor = "default";
        return Promise.reject(error);
    }
);

function updateProgress(e) {
    console.log("ProgressEvent:", e);
    if (e && e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        console.log("testing: ",progressBar.style.width = `${percentage}%`);
    }

}
updateProgress(); */


/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
/* getFavouritesBtn.addEventListener("click", favourite); */

export async function favourite(imgId) {

    try {
        console.log("Attempting to favorite image with ID:", imgId);
        const response = await axios.get('/favourites');
        const favourites = response.data;
        //found the favourites folder from the api and then grabbed it to get the existing 
        //console.log('these are ex:', favourites)

        const favouriteE = favourites.find((fav) => fav.image_id === imgId);

        if (favouriteE) {
            await axios.delete(`/favourites/${favouriteE.id}`);
            console.log(`Image ${imgId} removed from favourites.`)
        } else {
            await axios.post(
                '/favourites',
                { image_id: imgId },
                { headers: { "x-api-key": API_KEY } }
              );
            console.log(`Image ${imgId} added to favourites.`);
        }
    } catch (err) {
        console.error("error with the images:------------", err)
        console.log("Image ID:", imgId);
    }
}
//console.log("APIkey: --------",axios.defaults.headers.common);


async function getFavourites() {
    const response = await axios.get('/favourites');
    const favourites = response.data;
    //found the favourites folder from the api and then grabbed it
    console.log('these are ex:', favourites)

    Carousel.clear();
    //getting the carousel cleared

    //need to add favourites to the carousel
    favourites.forEach((favourite) => {
        const element3 = Carousel.createCarouselItem(favourite.image.url, "alt" ,favourite.id);
        Carousel.appendCarousel(element3);
    })
    Carousel.start();
    console.log("Favourites loaded successfully.---------------");
}
