class Parser {

    static toJson(data) {
        
        const string = JSON.stringify(data);
      
        const json = JSON.parse(string);
       
        return json;
    }
}

module.exports = { Parser }