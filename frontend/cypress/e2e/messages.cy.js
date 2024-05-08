describe('messages Tests', () => {

    function generateRandomGroupName(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let groupName = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            groupName += characters[randomIndex];
        }
        return groupName;
    }
    
    const randomGroupName = generateRandomGroupName(10);
    const randomEmail = `test${Math.floor(Math.random() * 1000000)}ensi${Math.floor(Math.random() * 1000000)}@ensimag.com`;
    const randomEmail2 = `test${Math.floor(Math.random() * 1000000)}ensi${Math.floor(Math.random() * 1000000)}@ensimag.com`;

    it("Register and login, and test messages functionalities", () => {
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

        // password
        cy.get('#loginview #password').clear().type('MyP@ssw0rd!');
        // try to login
        cy.get('#loginview > button').click();

        // create new group
        cy.get('#owned-input').clear().type(randomGroupName);
        cy.get('#addGroup').click();

        // verify messages elements
        cy.get('.joined-container ul li').click();
        cy.get('.message-manage legend').should('contain', randomGroupName);

        cy.get('#message-input').clear().type("Hi, mr second user");
        cy.get('#post-message').click();

        // verify if the message was posted
        cy.get('.message-me').should('contain', "Hi, mr second user");
    });

    it("Second user creation", () => {
        cy.visit("http://localhost:5173");
        // name
        cy.get('#createaccount #name').clear().type('seconduser');
        // email
        cy.get('#createaccount #email').clear().type(randomEmail2);
        // password
        cy.get('#createaccount #password').clear().type('MyP@ssw0rd!');
        // comfirm password
        cy.get('#createaccount #comfirm_password').clear().type('MyP@ssw0rd!');
        // sign up
        cy.get('#createaccount > button').click();
    });

    it("First user log in and add second user to group", () => {
        cy.visit("http://localhost:5173");
        // email
        cy.get('#loginview #email').clear().type(randomEmail);
        // password
        cy.get('#loginview #password').clear().type('MyP@ssw0rd!');
        // try to login
        cy.get('#loginview > button').click();

        // select the group
        cy.get('.owned-container ul li').click();
        cy.get('.group-manage .box').first().get('legend').should('contain', randomGroupName);

        // select the user we just created
        cy.get('#select-options').select(randomEmail2);
        cy.get('#select-button').click();
    });

    it("now second user sends a message", () => {
        cy.visit("http://localhost:5173");
        // email
        cy.get('#loginview #email').clear().type(randomEmail2);
        // password
        cy.get('#loginview #password').clear().type('MyP@ssw0rd!');
        // try to login
        cy.get('#loginview > button').click();

        // verify messages elements
        cy.get('.joined-container ul li').click();
        cy.get('.message-manage legend').should('contain', randomGroupName);

        cy.get('#message-input').clear().type("Hi, mr admin");
        cy.get('#post-message').click();

        // verify if the message was posted
        cy.get('.message-me').should('contain', "Hi, mr admin");
    });

    it("now first user login and read 2nd user's message", () => {
        cy.visit("http://localhost:5173");
        // email
        cy.get('#loginview #email').clear().type(randomEmail);
        // password
        cy.get('#loginview #password').clear().type('MyP@ssw0rd!');
        // try to login
        cy.get('#loginview > button').click();

        // Enter the group chat
        cy.get('.joined-container ul li').click();

        // verify message of 2nd user and his naame next to it
        cy.get('.message').should('contain', "Hi, mr admin");
        cy.get('.poster').should('contain', "seconduser");
    });
});