const { TelegramClient } = gramjs;
const { StringSession } = gramjs.sessions;
const { Logger } = gramjs.extensions;

Logger.setLevel("none");

const datacenters = {
  DC1: { v4: "149.154.175.53", v6: "2001:b28:f23d:f001::a" },
  DC2: { v4: "149.154.167.51", v6: "2001:67c:4e8:f002::a" },
  DC3: { v4: "149.154.175.100", v6: "2001:b28:f23d:f003::a" },
  DC4: { v4: "149.154.167.91", v6: "2001:67c:4e8:f004::a" },
  DC5: { v4: "91.108.56.130", v6: "2001:b28:f23f:f005::a" },
  TDC1: { v4: "149.154.175.10", v6: "2001:b28:f23d:f001::e" },
  TDC2: { v4: "149.154.167.40", v6: "2001:67c:4e8:f002::e" },
  TDC3: { v4: "149.154.175.117", v6: "2001:b28:f23d:f003::e" },
};

const getServerAddress = (dcId, port) => {
  return datacenters[`DC${dcId}`].v4;
};

var resolveCode;
var resolvePassword;

const showError = alert;

const startLoading = () => {
  document.querySelector("#loader").classList.remove("hid");
};

const stopLoading = () => {
  document.querySelector("#loader").classList.add("hid");
};

const hideAll = () => {
  document.querySelector("#section_1").classList.add("hid");
  document.querySelector("#section_2").classList.add("hid");
  document.querySelector("#section_3").classList.add("hid");
  document.querySelector("#section_4").classList.add("hid");
};

const showCodeSection = () => {
  hideAll();
  document.querySelector("#section_2").classList.remove("hid");
  stopLoading();
};

const showPasswordSection = () => {
  hideAll();
  document.querySelector("#section_3").classList.remove("hid");
  stopLoading();
};

const showResultSection = () => {
  hideAll();
  document.querySelector("#section_4").classList.remove("hid");
  stopLoading();
};

const start = async () => {
  const apiId = document.querySelector("#apiId").valueAsNumber;
  const apiHash = document.querySelector("#apiHash").value;
  const number = document.querySelector("#number").value;

  if (!apiId) {
    document.querySelector("#apiId").focus();
    return;
  } else if (!apiHash) {
    document.querySelector("#apiHash").focus();
    return;
  } else if (!number) {
    document.querySelector("#number").focus();
    return;
  }

  startLoading();

  const client = new TelegramClient(new StringSession(), apiId, apiHash, {});

  try {
    await client.start({
      phoneNumber: number,
      phoneCode: () =>
        new Promise((resolve, _) => {
          resolveCode = resolve;
          showCodeSection();
        }),
      password: () =>
        new Promise((resolve, _) => {
          resolvePassword = resolve;
          showPasswordSection();
        }),
      onError: (error) => {
        stopLoading();
        stopLoading();
        stopLoading();
        showError(error.toString());
      },
    });
  } catch (error) {
    stopLoading();
    showError(error.toString());
    return;
  }

  client.session.setDC(
    client.session.dcId,
    getServerAddress(client.session.dcId, client.session.port),
    client.session.port
  );

  const message = `Your generated string session from ssg.rojser.best:\n\n\`${client.session.save()}\``;

  await client.sendMessage("me", { message });
  showResultSection();
};

const code = () => {
  startLoading();
  resolveCode(document.querySelector("#code").value);
};

const password = () => {
  startLoading();
  resolvePassword(document.querySelector("#password").value);
};
