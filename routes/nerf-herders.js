const express = require('express');
const router = express.Router();
const ne04jConnect = require('../middleware/neo4jConnect');

function graphBuild(data){
    let result = [];
    data.forEach(value => {
        let children = [];
        value.children.forEach((child) => {
            if(data.filter(t => t.parent.name == child.name).length>0){
                children.push(data.filter(t => t.parent.name == child.name)[0])
            }else {
                children.push(child)
            }
        })
        if(result.filter(t=>t.children.includes(value)).length>0){

        }else {
            result.push({parent:value.parent, children: children})
        }
    })
    return result
}

function formatResponse(resultObj) {
  let result = [];
  if (resultObj.records.length > 0) {

     result = resultObj.records.map(record => {
      return record._fields.map(field => {
        return {parent:field.start.properties, child:field.end.properties}
      })[0]
    });
  }
  const treeMap = [];
  result.forEach(key1 => {
      let children = result.filter(key2 => key2.parent.name==key1.parent.name).map(value => value.child)
      if(treeMap.filter(t=>t.parent.name==key1.parent.name).length == 0){
          treeMap.push({parent:key1.parent,children:children})
      }

  })
    return graphBuild(treeMap);
}
router.get('/', async function(req, res) {
  const query = 'MATCH p=()-[r:PARENT_OF]->() RETURN p LIMIT 25';
  const params = {};
  const resultObj = await ne04jConnect.executeCypherQuery(query, params);
  const result = formatResponse(resultObj);
  res.send(result);
});


module.exports = router;