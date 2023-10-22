const express = require('express');
const crypto = require('crypto');
const app = express();

let resultados =  {
    pessoas: [{id:1, nome: "Marcelo"}, {id:2, nome: "João"}, {id:3, nome: "Maria"}],
    carros: [{id:1, modelo: "Fusca"}, {id:2, modelo: "Gol"}, {id:3, modelo: "Palio"}],
    animais: [{id:1, nome: "Cachorro"}, {id:2, nome: "Gato"}, {id:3, nome: "Papagaio"}]
  }


let cache = {
    data : resultados,
    etag: ''
}

  let versaoAtual = JSON.stringify(resultados);

  // Endpoints para pegar todos os recursos passados como referencia atraves a query string
  app.get('/pessoas', (req, res) => {
    res.status(200).json(resultados.pessoas);
  });

  app.get('/carros', (req, res) => {
    res.status(200).json(resultados.carros);
  });

  app.get('/animais', (req, res) => {
    res.status(200).json(resultados.animais);
  });

// Endpoints para pegar um recurso especifico da lista de recursos passados como referencia atraves a query string
app.get('/pessoas/:id' , (req,res) => {
    let id = parseInt(req.params.id);
    let itemConsultado = resultados.pessoas.find(p => p.id === id);

    const newEtag = crypto.createHash('md5').update(JSON.stringify(resultados)).digest('hex');
    
    if(!itemConsultado){
        res.status(404).json({"mensagem": "A pessoa consultada nao existe na base de dados!"});
    }
    else{
            if(req.headers['if-none-match'] === cache.etag){
                res.sendStatus(304);
                console.log("Os dados são os mesmos")
            }
            else{
                cache.data = resultados;
                cache.etag = newEtag;
                res.set('ETag', newEtag);
                res.status(200).json(itemConsultado);
                console.log("Os dados mudaram")
    
            }
    }
})

app.get('/carros/:id' , (req,res) => {
    let id = parseInt(req.params.id);
    let itemConsultado = resultados.carros.find(p => p.id === id);
    const newEtag = crypto.createHash('md5').update(JSON.stringify(resultados)).digest('hex');

    if(!itemConsultado){
        res.status(404).json({"mensagem": "O carro consultado nao existe na base de dados!"});
    }
    else{
        if(req.headers['if-none-match'] === cache.etag){
            res.sendStatus(304);
            console.log("Os dados são os mesmos")
        }
        else{
            cache.data = resultados;
            cache.etag = newEtag;
            res.set('ETag', newEtag);
            res.status(200).json(itemConsultado);
            console.log("Os dados mudaram")

        }
}
})

app.get('/animais/:id' , (req,res) => {
    let id = parseInt(req.params.id);
    let itemConsultado = resultados.animais.find(p => p.id === id);
    const newEtag = crypto.createHash('md5').update(JSON.stringify(resultados)).digest('hex');
    
    if(!itemConsultado){
        res.status(404).json({"mensagem": "O animal consultado nao existe na base de dados!"});
    }
    else{
        if(req.headers['if-none-match'] === cache.etag){
            res.sendStatus(304);
            console.log("Os dados são os mesmos")
        }
        else{
            cache.data = resultados;
            cache.etag = newEtag;
            res.set('ETag', newEtag);
            res.status(200).json(itemConsultado);
            console.log("Os dados mudaram")

        }
}
})






const port = 5550;
app.listen(port, () => console.log("Server inicializado com sucesso!"));