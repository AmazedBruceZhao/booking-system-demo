const username = 'bruce.zhao@esi-asia.com'
const password = 'P@ssw0rd2018'
const url = 'https://outlook.office365.com/EWS/Services.asmx'
export default function(content){
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
            'Authorization': 'Basic ' + btoa(username + ":" + password),
        },
        body: content
    })
}