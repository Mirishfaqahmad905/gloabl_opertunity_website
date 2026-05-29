fetch("http://localhost:3000/api/public/settings").then(r=>{console.log(r.status); return r.json()}).then(console.log).catch(console.error)
