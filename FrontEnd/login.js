fetch('http://', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: '',
        password: ''
    })

})
.then(res =>  res.json())


// addEventListener('Submit')
// on recupere email + passwords
// on verifie que les champs sont pas vides
// on verifie que l'user existe
// si oui on affiche index.html

//Stocker le token
//localStorage.setItem('token', data.token)