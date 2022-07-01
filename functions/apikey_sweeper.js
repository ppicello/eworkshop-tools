exports = async function(request, response){
  const httpClient = require("urllib");
  const user = "zownxxxx";
  const pass = "6f31d094-1e68-4977-8284-xxx";
  const uri = "https://cloud.mongodb.com/api/atlas/v1.0/orgs/xxxd233ab66b6053747cxxxx/apiKeys?itemsPerPage=200";
  const uri_delete = "https://cloud.mongodb.com/api/atlas/v1.0/orgs/xxxd233ab66b6053747cxxxx/apiKeys";
  let data_obj = null

  const options = {
    method: "GET",
    rejectUnauthorized: false,
    digestAuth: `${user}:${pass}`,
  };
  
  await httpClient.request(uri, options).then(function(result) {
    data_obj = JSON.parse(result.data.toString())
    console.log("Found " + data_obj.results.length + " api-keys for this Atlas organization")
    
  }).then(async function(){
    
    for(i=0; i<data_obj.results.length; i++) {
      // We are deleting all the api-keys that are not "Organization Owner"
      let deleteThis = true
      for(j=0; j<data_obj.results[i].roles.length; j++) {
        if(data_obj.results[i].roles[j].roleName === 'ORG_OWNER') {
          deleteThis = false //skip this api-key
        }        
      }
      if(deleteThis == true ) {
        let apikeyid = data_obj.results[i].id
        let delete_uri = uri_delete + "/" + apikeyid // Remove One Organization API Key
        
        const options_delete = {
          method: "DELETE",
          rejectUnauthorized: false,
          digestAuth: `${user}:${pass}`,
        };

        await httpClient.request(delete_uri, options_delete).then(function(result) {
          console.log("Deleting apikey id: " + apikeyid)
        }).catch(function (err) {
          console.error(err);
        })
      }
    }
    
  }).catch(function (err) {
    console.error(err);
    return
  })
  
};
