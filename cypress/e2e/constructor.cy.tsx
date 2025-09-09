// tests

describe('ingredients from api', function () {
    beforeEach(function () {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.viewport(1300, 800);
      cy.visit('http://localhost:4000')
    }
  )

    // adding an ingredient - bun
    it('adding bun as a burger item', function () {
        cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=construcor-ingredients]')
            .contains('Начинка')
            .should('exist');
    });
});

// open and close modal
describe('opening and closing modal', function () {
    // перезват запросов
    beforeEach(function () {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.viewport(1300, 800);
      cy.visit('http://localhost:4000')
    })
    // open modal
    it('open modal', function () {
        cy.contains('Детали ингредиента').should('not.exist');
        cy.contains('Булка').click();
        cy.contains('Детали ингредиента').should('exist');
        cy.get('#modals').contains('Булка').should('exist');
    });
    it('close modal with cross button', function() {
        cy.contains('Булка').click();
        cy.contains('Детали ингредиента').should('exist');
        cy.get('[data-cy=modal-close]').click();
        cy.contains('Детали ингредиента').should('not.exist');
    });
});

describe('post order modal', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'send-order.json' }).as('sendOrder');
    
    window.localStorage.setItem('refreshToken', JSON.stringify('mock-refreshToken'));
    cy.setCookie('accessToken', 'mock-accessToken');
    cy.viewport(1300,800);
    cy.visit('http://localhost:4000');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('creating a burger', function () {
    // adding the bun
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    //adding the mains
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    // adding the sauce
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();

    // making the order
    cy.get('[data-cy=order-create]').click();

    // the number of the order
    cy.get('[data-cy=order-number]').contains('87232').should('exist');

    // closing the order modal
    cy.get('#modals [data-cy=modal-close]').click();
    cy.get('[data-cy=order-number]').should('not.exist');

    cy.get('[data-cy=constructor]')
      .contains('Булка')
      .should('not.exist');
  });
});
