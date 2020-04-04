//////////////////////////////////////////////////////////////////////////////////
//		toScreenXY
//////////////////////////////////////////////////////////////////////////////////
function toScreenXY(vector, camera, video) {
var output = vector.clone();
output.project(camera);
output.x = Math.round((output.x + 1)*video.videoWidth/2);
output.y = Math.round((-output.y + 1)*video.videoHeight/2);
output.z = 0;
return output;
}
