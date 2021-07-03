module.exports = {
  encontrarChat: async (page, nome) => {
    const [span] = await page.$x(`//span[contains(text(), '${nome}')]`);
    return span;
  },

  encontrarIdDivChat: async (page, nome) => {
    const encontraChat = await module.exports.encontrarChat(page, nome);
    const divPai = await encontraChat.getProperty("parentNode");
    const { _remoteObject } = await divPai.getProperty("parentNode");
    return _remoteObject.description.replace(/\D/g, "");
  },

  enviarMensagem: async (page, mensagem, nome) => {
    const idDiv = await module.exports.encontrarIdDivChat(page, nome);
    await page.waitForTimeout(`div[id="tab${idDiv}]`);

    await page.$eval(
      `div[id="composer${idDiv}"]`,
      (el, value) => (el.innerHTML = value),
      `:task: ${mensagem}\ Preparada para deploy`
    );
    await page.click(`div[id="composer${idDiv}"]`);

    await page.keyboard.press("Enter");
  },
};
