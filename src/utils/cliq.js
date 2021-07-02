module.exports = {
  encontrarChat: async (page) => {
    console.log("Encontrando Chat");
    const [span] = await page.$x("//span[contains(text(), 'Queiroz')]");
    return span;
  },

  enviarMensagem: async (page, mensagem) => {
    console.log("Enviando Mensagem");
    await page.waitForTimeout('div[id="tab2198156834713932476]');

    await page.$eval(
      'div[id="composer2198156834713932476"]',
      (el, value) => (el.innerHTML = value),
      `:task: ${mensagem}\ Preparada para deploy`
    );
    await page.click('div[id="composer2198156834713932476"]');

    await page.keyboard.press("Enter");
    console.log("Mensagem Enviada");
  },
};
