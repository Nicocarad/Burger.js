Per fare funzionare la web app è necessario installare Node.js e installare i pachetti necessari tramite npm

La web app necessita di una connessione ad un database MongoDB; nel database andranno creato tre collezioni:
- users;
- products;
- orders.
N.B. l’utente amministratore è necessario registrarlo come cliente e poi modificare la voce "tipo" dell’apposito documento 
nel database, cambiandola da "cliente" ad "admin".

Per avviare la web app scrivere in console (aperta alla cartella del progetto) "npm start".
