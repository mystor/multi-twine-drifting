function Tiddler() {}
jpickle.emulated['tiddlywiki.Tiddler'] = Tiddler;

fetch("game1.tws").then(res => {
    res.text().then(t => {
        let res = jpickle.loads(t);
        console.log(JSON.dumps(res));
        console.log(t);
    });
});
