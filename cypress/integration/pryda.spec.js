/* eslint-disable no-undef */
describe('Pryda suite', () => {
  it('should check if sold out exists', () => {
    cy.visit('https://kaboodle.co.uk/event/eric-prydz');
    cy.findAllByText(/Sold Out/i).then(texts => {
      expect(texts.length).to.be.greaterThan(0);
    });
  });
});
