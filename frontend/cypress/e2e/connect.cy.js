describe('connect Tests', () => {

    const randomEmail = `test${Math.floor(Math.random() * 1000000)}ensi${Math.floor(Math.random() * 1000000)}@ensimag.com`;

    it("Register", () => {
        cy.visit("http://localhost:5173");
        // name
        cy.get('#createaccount #name').clear().type('ensimag');
        // email
        cy.get('#createaccount #email').clear().type(randomEmail);
        // password
        cy.get('#createaccount #password').clear().type('MyP@ssw0rd!');
        // comfirm password
        cy.get('#createaccount #comfirm_password').clear().type('MyP@ssw0rd!');
        // sign up
        cy.get('#createaccount > button').click();
        // we should see the success message
        cy.get('#createaccount > #success_message').should('contain', 'Compte créé avec succès !');
        // and also no error messages
        cy.get('#createaccount > #error_message').should('not.have.text');
        // verify email existing in login view
        cy.get('#loginview #email').should('have.value', randomEmail);
    });

    it("Register with existing email", () => {
        cy.visit("http://localhost:5173");
        // name
        cy.get('#createaccount #name').clear().type('ensimag');
        // email
        cy.get('#createaccount #email').clear().type(randomEmail);
        // password
        cy.get('#createaccount #password').clear().type('MyP@ssw0rd!');
        // comfirm password
        cy.get('#createaccount #comfirm_password').clear().type('MyP@ssw0rd!');
        // sign up
        cy.get('#createaccount > button').click();
        // we should see the fail message
        cy.get('#createaccount > #success_message').should('contain', 'Échec de la création du compte');
    });

    it("Register invalid info", () => {
        cy.visit("http://localhost:5173");
        // invalid name
        cy.get('#createaccount #name').clear().type('ens1');
        // invalid email
        cy.get('#createaccount #email').clear().type('ensimag@g');
        // invalid password
        cy.get('#createaccount #password').clear().type('aaaa');
        // passwords not matching
        cy.get('#createaccount #comfirm_password').clear().type('aaea');
        // we should see the error messages
        cy.get('#createaccount > #error_message').should('contain', 'Nom invalide !');
        cy.get('#createaccount > #error_message').should('contain', 'Email invalide !');
        cy.get('#createaccount > #error_message').should('contain', 'Mot de passe invalide !');
        cy.get('#createaccount > #error_message').should('contain', 'Revérifiez votre Mot de Passe !');
    });

    it("Login invalid info", () => {
        cy.visit("http://localhost:5173");
        // invalid email
        cy.get('#loginview #email').clear().type('ens1@');
        // invalid password
        cy.get('#loginview #password').clear().type('aaaa');
        // we should see the error messages
        cy.get('#loginview > #error_message').should('contain', 'Email invalide !');
        cy.get('#loginview > #error_message').should('contain', 'Mot de passe invalide !');
    });

    it("Login with incorrect info", () => {
        cy.visit("http://localhost:5173");
        // email
        cy.get('#loginview #email').clear().type(randomEmail);
        // incorrect password
        cy.get('#loginview #password').clear().type('MyP@ssw0rd!!');
        // try to login
        cy.get('#loginview > button').click();
        // we should see the fail messages
        cy.get('#loginview > #fail_message').should('contain', 'Email ou/et Mot de passe incorrect(s) !');
    });

    it("Login", () => {
        cy.visit("http://localhost:5173");
        // email
        cy.get('#loginview #email').clear().type(randomEmail);
        // password
        cy.get('#loginview #password').clear().type('MyP@ssw0rd!');
        // try to login
        cy.get('#loginview > button').click();
        // we should see Acceuil view
        cy.get('main > h2 > legend').should('contain', 'Bienvenue '+randomEmail+' !');
    });
});