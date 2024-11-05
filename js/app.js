const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBDflw7dOC8qkOYZXDZBVARqvQQLoqkUbQ",
    authDomain: "fiction-6bc9e.firebaseapp.com",
    projectId: "fiction-6bc9e",
    storageBucket: "fiction-6bc9e.appspot.com",
    messagingSenderId: "343399124890",
    appId: "1:343399124890:web:72f69d351e6b1af358b423",
    measurementId: "G-TVE2PW8EJH"
});

/* Firebase config */
const db = firebaseApp.firestore();
let docid = "";

function addItem() {
    const title = document.getElementById("title").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const year = document.getElementById("year").value.trim();
    const director = document.getElementById("director").value.trim();
    const rating = document.getElementById("rating").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();

    // Validation check
    if (!title || !genre || !year || !director || !rating || !description || !image) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    // Determine the selected category
    let category;
    if (document.getElementById("category-movie").checked) {
        category = "movies";
    } else if (document.getElementById("category-series").checked) {
        category = "series";
    } else if (document.getElementById("category-book").checked) {
        category = "books";
    } else {
        alert("Please select a category.");
        return;
    }

    // Add the item to the corresponding collection in Firestore
    db.collection(category).doc(title).set({
        title: title,
        genre: genre,
        year: year,
        director: director,
        rating: rating,
        description: description,
        image: image
    })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

    // Clear input fields
    document.getElementById("title").value = ""; 
    document.getElementById("genre").value = ""; 
    document.getElementById("year").value = ""; 
    document.getElementById("director").value = ""; 
    document.getElementById("rating").value = ""; 
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
}

function displayCollection(collectionName, elementId, limit = null) {
    const collectionRef = db.collection(collectionName);
    let query = collectionRef;

    if (limit) {
        query = query.limit(limit);
    }

    query.get().then((querySnapshot) => {
        const container = document.getElementById(elementId);
        container.innerHTML = ""; // Clear previous content

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement("div");
            item.classList.add("collection-item");
            item.innerHTML = `
                <h3>${data.title}</h3>
                <p>Genre: ${data.genre}</p>
                <p>Year: ${data.year}</p>
                <p>Director: ${data.director}</p>
                <p>Rating: ${data.rating}</p>
                <p>Description: ${data.description}</p>
                <img src="${data.image}" alt="${data.title}">
            `;
            container.appendChild(item);
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}