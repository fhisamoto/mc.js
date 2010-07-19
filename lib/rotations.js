var mag2 = function(vec) {
	return Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2); 
};

exports.lorentz_rotation = function(p_ref, k) {	
	var r = Math.sqrt(Math.pow(p_ref[0], 2) + Math.pow(p_ref[1], 2));
	
  var cos_theta = p_ref[0] / r,
			sin_theta = p_ref[1] / r, 
			cos_phi = p_ref[2] / Math.sqrt(mag2(p_ref)), 
			sin_phi = Math.sqrt(1 - Math.pow(cos_phi, 2));

  var beta = Math.sqrt(mag2(p_ref)) / p_ref[3];
  var gamma = 1./Math.sqrt( 1. - Math.pow(beta, 2) );
  var beta_gamma = beta * gamma;

  var a11 = cos_theta * cos_phi;
  var a12 = cos_theta * sin_phi;
  var a13 = -sin_theta;

  var a21 = -sin_phi;
  var a22 = cos_phi;

  var a31 = gamma * sin_theta * cos_phi;
  var a32 = gamma * sin_theta * sin_phi;
  var a33 = gamma * cos_theta;
  var a34 = - beta_gamma;

  var a41 = -beta_gamma * sin_theta * cos_phi;
  var a42 = -beta_gamma * sin_theta * sin_phi;
  var a43 = -beta_gamma * cos_theta;
  var a44 = gamma;

	return [ a11 * k[0] + a12 * k[1] + a13 * k[2], 
		a21 * k[0] + a22 * k[1],
		a31 * k[0] + a32 * k[1] + a33 * k[2] + a34 * k[3],
		a41 * k[0] + a42 * k[1] + a43 * k[2] + a44 * k[3]
	]; 
}

exports.inverse_lorentz_rotation = function(p_ref, k) {
	var r = Math.sqrt(Math.pow(p_ref[0], 2) + Math.pow(p_ref[1], 2));
	
  var cos_theta = p_ref[0] / r,
			sin_theta = p_ref[1] / r, 
			cos_phi = p_ref[2] / Math.sqrt(mag2(p_ref)), 
			sin_phi = Math.sqrt(1 - Math.pow(cos_phi, 2));
			
  var beta = Math.sqrt(mag2(p_ref)) / p_ref[3];
  var gamma = 1./Math.sqrt( 1. - Math.pow(beta, 2) );
  var beta_gamma = beta * gamma;

  var  a11 = cos_theta * cos_phi;
  var  a12 = -sin_phi;
  var  a13 = gamma * sin_theta * cos_phi;
  var  a14 = beta_gamma * sin_theta * cos_phi;

  var  a21 = cos_theta * sin_phi;
  var  a22 = cos_phi;
  var  a23 = gamma * sin_theta * sin_phi ;
  var  a24 = beta_gamma * sin_theta * sin_phi;
  
  var  a31 = - sin_theta ;
  var  a33 = gamma * cos_theta ;
  var  a34 = beta_gamma * cos_theta;

  var  a43 = beta_gamma ;
  var  a44 = gamma;

	return [
		a11 * k[0] + a12 * k[1] + a13 * k[2] + a14 * k[3], 
		a21 * k[0] + a22 * k[1] + a23 * k[2] + a24 * k[3],
		a31 * k[0]              + a33 * k[2] + a34 * k[3],
		                          a43 * k[2] + a44 * k[3]
	];
}



