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
const auth = firebaseApp.auth();
let docid = "";

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        displayUserInfo(user.uid);
        showFeaturesForUser(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

function displayUserInfo(userId) {
    db.collection("users").doc(userId).get().then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const userName = `${userData.fname} ${userData.lname}`;
            document.getElementById("user-name").textContent = userName;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function showFeaturesForUser(uid) {
    const specialFeatureElement = document.getElementById("special-feature");

    // List of UIDs that have access to the special feature
    const allowedUIDs = ["uYTPDko9CkYqIfO7GNaxSaNwnS72", "UID2", "UID3"]; // Replace with actual UIDs

    if (allowedUIDs.includes(uid)) {
        specialFeatureElement.style.display = "block";
    } else {
        specialFeatureElement.style.display = "none";
    }
}

function addItem() {
    const title = document.getElementById("title").value.trim();
    const year = document.getElementById("year").value.trim();
    const director = document.getElementById("director").value.trim();
    const rating = document.getElementById("rating").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();

    // Collect selected genres
    const genres = [];
    document.querySelectorAll('input[name="genre"]:checked').forEach((checkbox) => {
        genres.push(checkbox.value);
    });

    // Validation check
    if (!title || genres.length === 0 || !year || !director || !rating || !description || !image) {
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
        genre: genres,
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
    document.getElementById("year").value = ""; 
    document.getElementById("director").value = ""; 
    document.getElementById("rating").value = ""; 
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.querySelectorAll('input[name="genre"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });
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
            item.setAttribute('data-id', doc.id); // Store document ID for editing and deleting
            item.innerHTML = `
                <h3>${data.title}</h3>
                <p class="genre">Genre: ${data.genre}</p>
                <p class="year">Year: ${data.year}</p>
                <p class="director">Director: ${data.director}</p>
                <p class="rating">Rating: ${data.rating}</p>
                <p class="description">Description: ${data.description}</p>
                <img src="${data.image}" alt="${data.title}">
                <button class="edit-button" onclick="openPopover('${collectionName}', '${doc.id}')">Edit</button>
                <button class="delete-button" onclick="deleteItem('${collectionName}', '${doc.id}')">Delete</button>
            `;
            container.appendChild(item);
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

function openPopover(collectionName, docId) {
    const popover = document.getElementById('popover');
    popover.style.display = 'block';
    console.log(collectionName, docId);
    popover.setAttribute('data-collection', collectionName);
    popover.setAttribute('data-id', docId);
    let genre = document.getElementsByName("genre");
    // Går igjennom hver kategori og sjekker om den finnes i databasen
    
    db.collection(collectionName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Sjekker om doc-iden er den samme for den brukaren me skal redigere 
            if (docId == doc.id) {
                if (collectionName == "movies") {
                    document.getElementById("category-movie").checked = true;
                }
                if (collectionName == "series") {
                    document.getElementById("category-series").checked = true;
                }
                if (collectionName == "books") {
                    document.getElementById("category-book").checked = true;
                }
                document.getElementById("image").value = doc.data().image;
                document.getElementById("title").value = doc.data().title;
                for (let i=0; i < genre.length ; i++) {
                    console.log(genre[i].value);
                    for (let j=0; j<doc.data().genre.length;j++) {
                        if (genre[i].value == doc.data().genre[j]) {
                            console.log(genre[i].value); 
                            genre[i].checked = true; 
                        }
                    }
                }
                document.getElementById("year").value = doc.data().year;
                document.getElementById("director").value = doc.data().director;
                document.getElementById("rating").value = doc.data().rating;
                document.getElementById("description").value = doc.data().description;
            }
        });
    })
}

function closePopover() {
    const popover = document.getElementById('popover');
    popover.style.display = 'none';
}

function updateItem() {
    const popover = document.getElementById('popover');
    const collectionName = popover.getAttribute('data-collection');
    const docId = popover.getAttribute('data-id');

    const updatedData = {
        image: document.getElementById("image").value.trim(),
        title: document.getElementById("title").value.trim(),
        genre: Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(checkbox => checkbox.value),
        year: document.getElementById("year").value.trim(),
        director: document.getElementById("director").value.trim(),
        rating: document.getElementById("rating").value.trim(),
        description: document.getElementById("description").value.trim()
    };
    
    db.collection(collectionName).doc(docId).update(updatedData)
    .then(() => {
        console.log("Document successfully updated!");
        displayCollection(collectionName, `index-${collectionName}-list`);
        closePopover();
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
}

function deleteItem(collectionName, docId) {
    if (confirm("Er du sikker på at du vil slette dette innholdet?")) {
        db.collection(collectionName).doc(docId).delete()
        .then(() => {
            console.log("Document successfully deleted!");
            displayCollection(collectionName, `index-${collectionName}-list`);
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error deleting document: ", error);
        });
    }
}