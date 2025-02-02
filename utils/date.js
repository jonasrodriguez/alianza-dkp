module.exports = {
  dbDate: () => {
    const now = new Date(Date.now());
    var dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    var timeOptions = { hour12: false, hour: '2-digit', minute:'2-digit' };
    return now.toLocaleDateString('es', dateOptions) + " " + now.toLocaleTimeString('en', timeOptions);
  },
  logDate: () => {
    const now = new Date(Date.now());
		return `${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()}`;
  },
  logDateTime: () => {
    const now = new Date(Date.now());
    return `[${("0" + now.getDate()).slice(-2)}/${("0" + (now.getMonth() + 1)).slice(-2)}/${now.getFullYear()} ${("0" + now.getHours()).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}:${("0" + now.getSeconds()).slice(-2)}] `;
  }
}
