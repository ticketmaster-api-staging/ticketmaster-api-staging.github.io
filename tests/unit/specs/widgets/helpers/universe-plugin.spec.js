import universePlugin from 'products-and-docs/widgets/helpers/universe-plugin';

it('#embedUniversePlugin should create elem', () => {
  universePlugin.embedUniversePlugin();
  let elem = document.getElementById('id_universe_widget');
  expect(elem.src).toBe('https://www.universe.com/embed.js');
});
