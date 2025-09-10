// tests

// variable url
const testUrl =  'http://localhost:4000';

const selectors = {
  mains: '[data-cy=mains-ingredients]',
  constructorIngredients: '[data-cy=construcor-ingredients]',
  bun: '[data-cy=bun-ingredients]',
  sauces: '[data-cy=sauces-ingredients]',
  orderCreate: '[data-cy=order-create]',
  orderNumber: '[data-cy=order-number]',
  modalClose: '[data-cy=modal-close]',
  modals: '#modals',
  constructor: '[data-cy=constructor]',
  ingredientCard: '[data-cy=ingredient-card]'
} as const;

const texts = {
  details: 'Детали ингредиента',
  bun: 'Булка',
  filling: 'Начинка'
} as const;

describe('ingredients from api', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  // adding an ingredient - bun
  it('adding bun as a burger item', function () {
    cy.get(selectors.mains)
      .find(selectors.ingredientCard)
      .first()
      .then(($ingredient) => {
        const ingredientName = $ingredient.text().trim();

        cy.wrap($ingredient).contains('Добавить').click();

        cy.get(selectors.constructorIngredients)
          .should('contain.text', ingredientName);
      });
  });
});

// open and close modal
describe('opening and closing modal', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  it('open modal', function () {
    cy.get(selectors.bun)
      .find(selectors.ingredientCard)
      .first()
      .then(($ingredient) => {
        const ingredientName = $ingredient.find('[data-cy=ingredient-title]').text().trim();

        cy.wrap($ingredient).click();

        cy.contains(texts.details).should('exist');
        cy.get(selectors.modals).should('contain.text', ingredientName);
      });
  });

  it('close modal with cross button', function () {
    cy.get(selectors.mains)
      .find(selectors.ingredientCard)
      .first()
      .click();

    cy.contains(texts.details).should('exist');
    cy.get(selectors.modalClose).click();
    cy.contains(texts.details).should('not.exist');
  });
});

describe('post order modal', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'send-order.json' }).as('sendOrder');

    window.localStorage.setItem('refreshToken', JSON.stringify('mock-refreshToken'));
    cy.setCookie('accessToken', 'mock-accessToken');
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('creating a burger', function () {
    // adding the bun
    cy.get(selectors.bun).contains('Добавить').click();
    // adding the mains
    cy.get(selectors.mains).contains('Добавить').click();
    // adding the sauce
    cy.get(selectors.sauces).contains('Добавить').click();

    // making the order
    cy.get(selectors.orderCreate).click();

    // the number of the order
    cy.get(selectors.orderNumber).contains('87232').should('exist');

    // closing the order modal
    cy.get(`${selectors.modals} ${selectors.modalClose}`).click();
    cy.get(selectors.orderNumber).should('not.exist');

    cy.get(selectors.constructor)
      .contains(texts.bun)
      .should('not.exist');
  });
});
