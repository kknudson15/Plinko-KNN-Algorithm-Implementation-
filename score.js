/*
_ = lodash library
This script implements K-Nearest neighbors for the plink example
The goal is to predict the correct bucket that the ball will drop in from
a specific point
*/


const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition,bounciness,size,bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
 const [testSet, trainingSet] =  splitDataSet(outputs, testSetSize);
 
 _.range(1,20).forEach(k => {
  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
    .size()
    .divide(testSetSize)
    .value();

    console.log("For k of ", k, "Accuracy is : ", accuracy);
  });
}

function knn (data, point, k){
  return _.chain(data)
  .map(row => [distance(row[0], point), row[3]])
  .sortBy(row => row[3])
  .slice(0,k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();
}

function distance(pointA, pointB){
  return Math.abs(pointA-pointB);
}

function splitDataSet(data, testCount){
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled,0,testCount);
  const trainingSet = _.slice(shuffled,testCount);

  return [testSet, trainingSet];
}