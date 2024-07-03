// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { setDoc, doc, getFirestore, getDocs, collection, updateDoc, deleteDoc,addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBXvblA9YOcNbFsnm4muM8VWD9UkjVL-sU",
    authDomain: "tache-de-validation-js.firebaseapp.com",
    projectId: "tache-de-validation-js",
    storageBucket: "tache-de-validation-js.appspot.com",
    messagingSenderId: "1018234718845",
    appId: "1:1018234718845:web:e80d3b7b569bc1ca283f14",
    measurementId: "G-EPVF9RSK3Q"
  };

  // Initialize Firestore
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
   

  let students = [];
  // Fonction pour charger les étudiants depuis Firestore
  async function etudiantsFirestore() {
      const querySnapshot = await getDocs(collection(db, "students"));
      students = [];
      querySnapshot.forEach((doc) => {
          const student = doc.data();
          student.id = doc.id;
          students.push(student);
      });
      filtre();
  }
  
// Initialiser les étudiants à partir de Firestore
etudiantsFirestore();

const NbreEtudiantsPage = 5;
let PageCurrent = 1;

function Moyenne() {
    if (students.length===0) {
        return 0
    } else {
        
        let Total = 0;
        for (const student of students) {
            Total += student.note;
        }
        return Total / students.length;
    }
}

// FONCTION SOMME DES NOTES
function SommeNote() {
    let totalNote = 0
    for (const chaqueNote of students) {
        totalNote += chaqueNote.note
    }
    return totalNote
}


// FONCTION SOMME DES AGES
function SommeAge() {
    let totalAge = 0
    for (const chaqueAge of students) {
        totalAge += chaqueAge.age
    }
    return totalAge
}

// FONCTION NOMBRE DE NOTES
function compterNotes() {
    return students.length;
}

// FONCTION NOMBRE D'AGES
function compterAge() {
    return students.length;
}
// mettre les icones dans les variables
const supprimer = '<i class="fa-solid fa-trash border border-danger p-2 rounded" style="color: red;" ></i>';
const modifier = '<i class="fa-solid fa-pen ms-4 border border-success p-2 rounded" style="color: green;"></i>'
// Fonction pour afficher les étudiants
function AfficheEtudiant(EtudiantAffiche) {
    const tbody = document.getElementById('Tbody');
    tbody.innerHTML = '';

    // utliser la boucle for pour afficher
    for (let i = 0; i < EtudiantAffiche.length; i++) {
        const student = EtudiantAffiche[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${student.nom}</td><td>${student.prenom}</td><td>${student.note}</td><td>${student.age}</td> <td données-id="${student.id}">${supprimer} ${modifier}</td>`;
        tbody.appendChild(tr);
    }

}

// enregister les données dans le local storage et l'afficher dans le tableau
let envoyerModal = document.getElementById('envoyerModal');
envoyerModal.addEventListener('click', async() => {
    let prenomAjout = document.getElementById('prenomAjout').value;
    let nomAjout = document.getElementById('nomAjout').value;
    let ageAjout = parseInt(document.getElementById('ageAjout').value);
    let noteAjout = parseFloat(document.getElementById('noteAjout').value);

    if (prenomAjout === '' || nomAjout === '' || ageAjout === '' || noteAjout === ''|| noteAjout>20) {
        alert('Veuillez renseigner les champs');
    } else {
        try {
            await addDoc(collection(db, "students"), {
                prenom: prenomAjout,
                nom: nomAjout,
                age: ageAjout,
                note: noteAjout
              });
            console.log(prenom,nom);
          } catch (error) {
            console.log("Error writing document: ", error);
          }
        viderFormulaire();
        filtre();
        modal.style.display = 'none'; // Fermer le modal après ajout
    }
});

// fonction de la pagination
function Pagination(EtudiantPagination) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const pageCount = Math.ceil(EtudiantPagination.length / NbreEtudiantsPage);

    // Ajouter l'icône "Précédent"
    if (PageCurrent > 1) {
        const precedentePageItem = document.createElement('a');
        precedentePageItem.href = "#";
        precedentePageItem.className = "page-link";
        precedentePageItem.innerHTML = '<i class="fas fa-chevron-left"></i>';
        precedentePageItem.onclick = function (event) {
            event.preventDefault();
            PageCurrent--;
            filtre();
        };
        const precedentePageLi = document.createElement('li');
        precedentePageLi.className = "page-item";
        precedentePageLi.appendChild(precedentePageItem);
        pagination.appendChild(precedentePageLi);
    }

    // parcourir le nombre de page et mettre les liens de switch entre les paginations
    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('a');
        pageItem.href = "#";
        pageItem.className = "page-link";
        pageItem.innerText = i;
        pageItem.onclick = function (event) {
            event.preventDefault();
            PageCurrent = i;
            filtre();
        };
        const pageLi = document.createElement('li');
        pageLi.className = "page-item";
        if (i === PageCurrent) {
            pageLi.classList.add('active');
        }
        pageLi.appendChild(pageItem);
        pagination.appendChild(pageLi);
    }

    // Ajouter l'icône "Suivant"
    if (PageCurrent < pageCount) {
        const suivantePageItem = document.createElement('a');
        suivantePageItem.href = "#";
        suivantePageItem.className = "page-link";
        suivantePageItem.innerHTML = '<i class="fas fa-chevron-right"></i>';
        suivantePageItem.onclick = function (event) {
            event.preventDefault();
            PageCurrent++;
            filtre();
        };
        const suivantePageLi = document.createElement('li');
        suivantePageLi.className = "page-item";
        suivantePageLi.appendChild(suivantePageItem);
        pagination.appendChild(suivantePageLi);
    }
}

// fonction du filtre là où j'ai appelé les autres fonctions
function filtre() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const EtudiantFiltres = students.filter(student =>
        student.nom.toLowerCase().includes(searchInput) || student.prenom.toLowerCase().includes(searchInput)
    );

    const startIndex = (PageCurrent - 1) * NbreEtudiantsPage;
    const EtudiantAffiche = EtudiantFiltres.slice(startIndex, startIndex + NbreEtudiantsPage);

    AfficheEtudiant(EtudiantAffiche);
    Pagination(EtudiantFiltres);

    document.getElementById('MoyGen').innerText = Math.round(Moyenne() * 100) / 100;
    document.getElementById('card1').innerText = SommeNote();
    document.getElementById('card2').innerText = "La somme des ages est égale à " + SommeAge()
    document.getElementById('card3').innerText = "Le nombre total de notes est égale à " + compterNotes(students)
    document.getElementById('card4').innerText = "Le nombre total d'âges est égale à " + compterAge(students)

}

document.getElementById('searchInput').addEventListener('input', () => {
    PageCurrent = 1;
    filtre();
});



// Afficher le modal
let bouttonAjout = document.getElementById('bouttonAjout');
let modal = document.getElementById('modal');
let closeModal = document.getElementById('closeModal');

// une fonction pour vider les champs du formulaire quand on ferme
function viderFormulaire() {
    let formulaire = document.getElementById('formulaire')
    formulaire.reset()
}
// evenement pour afficher le modal à partir du boutton ajouter
bouttonAjout.addEventListener('click', () => {
    modal.style.display = 'block';
});

// un autre évenement pour fermer le modal à partir du bouton fermer
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    viderFormulaire()
});

// evenement pour fermer le modal en cliquant à l'extérieur de celui-ci
document.getElementById('modal').addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        viderFormulaire()
    }
});

// fonction de modification
async function modifierEtudiant(event) {
    const studentId = event.target.closest('td').getAttribute('données-id'); // Récupérer l'ID de l'étudiant

    try {
        // Récupérer l'étudiant à partir de l'ID
        const student = students.find(s => s.id === studentId);

        // Remplir les champs du modal avec les informations de l'étudiant
        document.getElementById('prenomAjout').value = student.prenom;
        document.getElementById('nomAjout').value = student.nom;
        document.getElementById('ageAjout').value = student.age;
        document.getElementById('noteAjout').value = student.note;

        // Afficher le modal
        modal.style.display = 'block';

        // Supprimer les gestionnaires d'événements précédents pour éviter les doublons
        envoyerModal.replaceWith(envoyerModal.cloneNode(true));
        envoyerModal = document.getElementById('envoyerModal');

        // Ajouter un nouveau gestionnaire d'événements pour enregistrer les modifications
        envoyerModal.addEventListener('click', async () => {
            const prenomAjout = document.getElementById('prenomAjout').value;
            const nomAjout = document.getElementById('nomAjout').value;
            const ageAjout = parseInt(document.getElementById('ageAjout').value);
            const noteAjout = parseFloat(document.getElementById('noteAjout').value);

            // Vérifier si les champs ne sont pas vides et les convertir correctement
            if (prenomAjout !== '' && nomAjout !== '' && !isNaN(ageAjout) && !isNaN(noteAjout)) {
                try {
                    // Mettre à jour le document Firestore avec les nouvelles valeurs
                    await updateDoc(doc(db, "students", studentId), {
                        prenom: prenomAjout,
                        nom: nomAjout,
                        age: ageAjout,
                        note: noteAjout
                    });

                    // Fermer le modal après modification
                    modal.style.display = 'none';
                    viderFormulaire();
                    etudiantsFirestore(); // Mettre à jour la liste des étudiants depuis Firestore
                } catch (error) {
                    console.error("Error updating document: ", error);
                }
            } else {
                alert('Veuillez remplir tous les champs correctement.');
            }
        });
    } catch (error) {
        console.error("Error retrieving student data: ", error);
    }
}
 
// fonction pour supprimer un étudiant par l'icône supprimer
async function supprimerEtudiant(studentID) {
    try {
        await deleteDoc(doc(db, "students", studentID));
        await etudiantsFirestore(); // Mettez à jour la liste des étudiants après suppression
    } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
    }
}

// appel des fonctions de modification et de suppression sur les icones pour s'assurer que ça vienne normalement
document.getElementById('Tbody').addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-trash')) {
        const studentID=event.target.closest('td').getAttribute('données-id');
        supprimerEtudiant(studentID);
        
    } else if (event.target.classList.contains('fa-pen')) {
        modifierEtudiant(event);
    }
});

window.onload = function() {
    filtre();
};




