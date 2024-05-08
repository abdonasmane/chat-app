describe('groups Tests', () => {

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

    it("Register and login, and test group functionalities", () => {
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
        // verify results
        cy.get('.joined-container ul').contains('li', randomGroupName).should('exist');
        cy.get('.owned-container ul').contains('li', randomGroupName).should('exist');

        // verify manage group elements
        cy.get('.owned-container ul li').click();
        cy.get('.group-manage .box').first().get('legend').should('contain', randomGroupName);
        // verify its empty in the beginning
        cy.get('.member-container .no-members-message').should('contain', 'Vous êtes le seul membre dans ce groupe');

        let addedMember = ''
        cy.get('#select-options').invoke('val').then(value => {addedMember = value});
        cy.get('#select-button').click();
        // now we verify if the memeber is added
        cy.get('.member-container ul li span').should('contain', addedMember);
        // now we remove the memeber
        cy.get('.member-container ul li button').click();
        cy.get('.member-container .no-members-message').should('contain', 'Vous êtes le seul membre dans ce groupe');
    });
});