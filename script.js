// Configuration - IMPORTANT: Adapter l'URL à votre projet
const API_BASE_URL = 'http://localhost:8080/Projet-soa/api';

// Variables globales
let currentAction = null;
let currentPersonId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger toutes les personnes au démarrage
    loadAllPersons();
    
    // Configurer le formulaire
    var form = document.getElementById('personForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Configurer le bouton de recherche
    var searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchById);
    } else {
        // Si le bouton n'a pas d'ID, utiliser l'événement onclick sur le bouton de recherche
        var searchButtons = document.querySelectorAll('.btn-primary');
        if (searchButtons.length > 0) {
            searchButtons[0].addEventListener('click', searchById);
        }
    }
    
    // Initialiser les événements de validation
    initFormValidation();
});

// ====================
// FONCTIONS PRINCIPALES
// ====================

// 1. Charger toutes les personnes
function loadAllPersons() {
    showLoading(true);
    
    fetch(API_BASE_URL + '/personnes', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(handleResponse)
    .then(function(persons) {
        // Vérifier si la réponse est valide
        if (!persons || !Array.isArray(persons)) {
            console.error('Réponse invalide du serveur:', persons);
            throw new Error('Format de données invalide reçu du serveur');
        }
        
        displayPersons(persons);
        showAlert(persons.length + ' personne(s) chargée(s)', 'success');
    })
    .catch(function(error) {
        console.error('Erreur lors du chargement:', error);
        showAlert('Impossible de charger les personnes: ' + error.message, 'danger');
    })
    .finally(function() {
        showLoading(false);
    });
}

// 2. Rechercher par ID
function searchById() {
    var searchIdInput = document.getElementById('searchId');
    var id = searchIdInput ? searchIdInput.value.trim() : '';
    
    if (!id) {
        showAlert('Veuillez entrer un ID', 'warning');
        return;
    }
    
    showLoading(true);
    
    fetch(API_BASE_URL + '/personnes/id/' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(handleResponse)
    .then(function(person) {
        // Vérifier si la personne existe
        if (!person) {
            showAlert('Aucune personne trouvée avec l\'ID ' + id, 'info');
            displayPersons([]);
            return;
        }
        
        // Formatage sécurisé des données
        var formattedPerson = {
            id: person.id || '',
            name: person.name || person.Name || '',
            age: person.age || person.Age || ''
        };
        
        displayPersons([formattedPerson]);
        showAlert('Personne trouvée (ID: ' + id + ')', 'success');
    })
    .catch(function(error) {
        console.error('Erreur lors de la recherche:', error);
        showAlert('Erreur lors de la recherche: ' + error.message, 'danger');
    })
    .finally(function() {
        showLoading(false);
    });
}

// 3. Afficher les personnes dans le tableau
function displayPersons(persons) {
    var tableBody = document.getElementById('personsTable');
    var personCount = document.getElementById('personCount');
    
    // Vérification de sécurité des données
    if (!persons || !Array.isArray(persons)) {
        console.error('Données invalides reçues:', persons);
        persons = [];
    }
    
    // Filtrer les entrées null/undefined
    persons = persons.filter(function(person) {
        return person !== null && person !== undefined;
    });
    
    if (persons.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted"><i class="fas fa-info-circle me-2"></i>Aucune personne trouvée</td></tr>';
        if (personCount) {
            personCount.textContent = '0 personnes';
        }
        return;
    }
    
    var html = '';
    for (var i = 0; i < persons.length; i++) {
        var person = persons[i];
        
        // Vérification de sécurité pour chaque personne
        var id = person.id || '';
        var nom = (person.name || person.Name || '').toString();
        var age = person.age || person.Age || '';
        
        html += '<tr>';
        html += '<td>' + id + '</td>';
        html += '<td>' + nom + '</td>';
        html += '<td>' + age + '</td>';
        html += '<td>';
        html += '<button class="btn btn-warning btn-sm btn-action" onclick="editPerson(' + id + ')">';
        html += '<i class="fas fa-edit me-1"></i>Modifier';
        html += '</button> ';
        html += '<button class="btn btn-danger btn-sm btn-action" onclick="showDeleteModal(' + id + ')">';
        html += '<i class="fas fa-trash me-1"></i>Supprimer';
        html += '</button>';
        html += '</td>';
        html += '</tr>';
    }
    
    tableBody.innerHTML = html;
    if (personCount) {
        personCount.textContent = persons.length + ' personne(s)';
    }
}

// 4. Gérer le formulaire (Ajout/Modification)
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Utiliser les noms de propriétés EXACTS de l'entité JPA
    var nameInput = document.getElementById('name');
    var ageInput = document.getElementById('age');
    var personIdInput = document.getElementById('personId');
    
    // Utiliser les noms de champs en MINUSCULES
    var personData = {
        name: nameInput.value,
        age: parseInt(ageInput.value)
    };
    
    var personId = personIdInput ? personIdInput.value : '';
    var isUpdate = personId !== '';
    
    showLoading(true);
    
    var url = isUpdate ? 
        API_BASE_URL + '/personnes/update/' + personId : 
        API_BASE_URL + '/personnes/add';
    
    var method = isUpdate ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(personData)
    })
    .then(handleResponse)
    .then(function(result) {
        showAlert('Personne ' + (isUpdate ? 'modifiée' : 'ajoutée') + ' avec succès!', 'success');
        resetForm();
        loadAllPersons();
    })
    .catch(function(error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        showAlert('Erreur: ' + error.message, 'danger');
    })
    .finally(function() {
        showLoading(false);
    });
}

// 5. Éditer une personne
function editPerson(id) {
    if (!id || id === 'undefined' || id === 'null') {
        console.error('ID invalide pour édition:', id);
        showAlert('ID de personne invalide', 'danger');
        return;
    }
    
    showLoading(true);
    
    fetch(API_BASE_URL + '/personnes/id/' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(handleResponse)
    .then(function(person) {
        // Vérification de sécurité
        if (!person) {
            console.error('Personne non trouvée pour l\'ID:', id);
            showAlert('Personne non trouvée avec l\'ID ' + id, 'danger');
            return;
        }
        
        // Formatage sécurisé des données
        var nom = (person.name || person.Name || '').toString();
        var age = person.age || person.Age || '';
        
        // Remplir le formulaire
        document.getElementById('personId').value = person.id || id;
        document.getElementById('name').value = nom;
        document.getElementById('age').value = age;
        
        // Changer le titre
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-user-edit me-2"></i>Modifier la personne (ID: ' + (person.id || id) + ')';
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save me-1"></i>Mettre à jour';
        
        // Faire défiler vers le formulaire
        document.getElementById('name').scrollIntoView({ behavior: 'smooth' });
        
        showAlert('Formulaire pré-rempli pour modification', 'info');
    })
    .catch(function(error) {
        console.error('Erreur lors du chargement pour édition:', error);
        showAlert('Erreur lors du chargement des données: ' + error.message, 'danger');
    })
    .finally(function() {
        showLoading(false);
    });
}

// 6. Supprimer une personne
function showDeleteModal(id) {
    if (!id || id === 'undefined' || id === 'null') {
        console.error('ID invalide pour suppression:', id);
        showAlert('ID de personne invalide', 'danger');
        return;
    }
    
    currentAction = 'delete';
    currentPersonId = id;
    
    var confirmMessage = document.getElementById('confirmMessage');
    if (confirmMessage) {
        confirmMessage.textContent = 'Êtes-vous sûr de vouloir supprimer la personne avec l\'ID ' + id + ' ?';
    }
    
    var confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        var modal = new bootstrap.Modal(confirmModal);
        modal.show();
    }
}

// Cette fonction doit être appelée par le bouton Confirmer du modal
function confirmAction() {
    if (currentAction === 'delete' && currentPersonId) {
        deletePerson(currentPersonId);
    }
    
    // Fermer le modal
    var confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        var modal = bootstrap.Modal.getInstance(confirmModal);
        if (modal) {
            modal.hide();
        }
    }
    
    // Réinitialiser
    currentAction = null;
    currentPersonId = null;
}

function deletePerson(id) {
    if (!id || id === 'undefined' || id === 'null') {
        console.error('ID invalide pour suppression:', id);
        showAlert('ID de personne invalide', 'danger');
        return;
    }
    
    showLoading(true);
    
    fetch(API_BASE_URL + '/personnes/delete/' + id, {
        method: 'DELETE'
    })
    .then(handleResponse)
    .then(function() {
        showAlert('Personne supprimée avec succès', 'success');
        loadAllPersons();
    })
    .catch(function(error) {
        console.error('Erreur lors de la suppression:', error);
        showAlert('Erreur: ' + error.message, 'danger');
    })
    .finally(function() {
        showLoading(false);
    });
}

// ====================
// FONCTIONS UTILITAIRES
// ====================

// 7. Réinitialiser le formulaire
function resetForm() {
    var form = document.getElementById('personForm');
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
    }
    
    var personIdInput = document.getElementById('personId');
    if (personIdInput) {
        personIdInput.value = '';
    }
    
    var formTitle = document.getElementById('formTitle');
    if (formTitle) {
        formTitle.innerHTML = '<i class="fas fa-user-plus me-2"></i>Ajouter une personne';
    }
    
    var submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save me-1"></i>Enregistrer';
    }
    
    // Réinitialiser les classes de validation
    var formControls = document.querySelectorAll('#personForm .form-control');
    for (var i = 0; i < formControls.length; i++) {
        formControls[i].classList.remove('is-valid', 'is-invalid');
    }
}

// 8. Validation du formulaire
function initFormValidation() {
    var form = document.getElementById('personForm');
    if (!form) return;
    
    var inputs = form.querySelectorAll('input[required]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    }
    
    // Réinitialiser la validation quand on clique sur Annuler
    var cancelBtn = document.querySelector('button[onclick="resetForm()"]');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
}

function validateForm() {
    var form = document.getElementById('personForm');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    
    return true;
}

// 9. Gestion des alertes
function showAlert(message, type) {
    if (!type) type = 'info';
    
    var alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    // Nettoyer les anciennes alertes
    alertContainer.innerHTML = '';
    
    var alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-' + type + ' alert-dismissible fade show';
    alertDiv.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    
    alertContainer.appendChild(alertDiv);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(function() {
        if (alertDiv.parentNode) {
            alertDiv.classList.remove('show');
            setTimeout(function() {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 150);
        }
    }, 5000);
}

// 10. Indicateur de chargement
function showLoading(show) {
    var loadingDiv = document.getElementById('loading');
    var submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (submitBtn) submitBtn.disabled = true;
    } else {
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

// ====================
// NOUVELLE FONCTION POUR GÉRER LES RÉPONSES
// ====================
function handleResponse(response) {
    // Vérifier si la réponse est valide
    if (!response) {
        throw new Error('Réponse vide reçue du serveur');
    }
    
    // Vérifier si la réponse est vide (204 No Content)
    if (response.status === 204) {
        return null;
    }
    
    // Vérifier si la réponse est valide
    if (!response.ok) {
        return response.text().then(function(text) {
            try {
                // Essayer de parser comme JSON
                var errorData = JSON.parse(text);
                var errorMessage = errorData.message || errorData.error || text;
                throw new Error('Erreur ' + response.status + ': ' + errorMessage);
            } catch (e) {
                // Si ce n'est pas du JSON, utiliser le texte brut
                throw new Error('Erreur ' + response.status + ': ' + text);
            }
        });
    }
    
    // Vérifier si la réponse contient du JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json().then(function(data) {
            // Vérification supplémentaire des données
            if (data === null || data === undefined) {
                throw new Error('Données nulles reçues du serveur');
            }
            return data;
        });
    }
    
    // Si ce n'est pas du JSON, renvoyer null
    return response.text().then(function(text) {
        if (text) {
            console.warn('Réponse non JSON reçue:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                return text;
            }
        }
        return null;
    });
}