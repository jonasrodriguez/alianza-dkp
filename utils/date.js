module.exports = {
  logDate: () => {
    const now = new Date(Date.now());
		return `${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()}`;
  },
  logDateTime: () => {
    const now = new Date(Date.now());
    return `[${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()} ${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}:${("0" + now.getSeconds()).slice(-2)}] `;
  }
}
