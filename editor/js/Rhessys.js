function createTreeAtPos(x,y,z){

            var callback = function(geometry, materials){
                var default_mat = new THREE.MeshLambertMaterial({color: 0x223311 });
                
                var tree = new THREE.Mesh(geometry, default_mat);
                var scale = 64;
                tree.castShadow = true;
                tree.receiveShadow = true;
                tree.position.set(x,y,z);

                tree.scale.set(scale, scale, scale);
                 
                // obj3d.castShadow = true;
                // obj3d.receiveShadow = true;
                // obj3d.name = "ModelContainer"
                tree.name = "TreeModel";
                editor.addObject(tree);
               
            }
           	var	mloader = new THREE.JSONLoader();
            mloader.load("../../streetview-studio/models/tree.js",callback);
        }




        function createGround(){
            var ground = new THREE.Mesh(
                                new THREE.CubeGeometry(1024, 1, 1024), 
                                new THREE.MeshLambertMaterial({
                                    emissive: 'white', 
                                    transparent: true, 
                                    opacity: 0
                        }));
                        ground.overdraw = true;
                        ground.receiveShadow = true;
                        ground.position.set(0, 2, 0);
                        ground.name = "ground";
                        editor.addObject(ground);
                        //ground.translateY(50);
        }     


        function createLightAtPos(x,y,z){
            //Some problem with directional light creating empty objects visible in the editor list of objects
            var dlight = new THREE.SpotLight(0xffffff);
            dlight.position.set(x,y,z);
            
            dlight.castShadow = true;
            dlight.shadowDarkness = 0.5;
            //dlight.shadowCameraVisible = true;

            dlight.target.name = "lightTarget";
            dlight.add(dlight.target);
            dlight.target.position.set(0,-10,0);
            //dlight.perspe
            //console.log(dlight.children);//.name = "shadowCamera";


            dlight.name = "light";
            dlight.intensity = 7;
            editor.addObject(dlight);
            


            //editor.addObject(dlight.target);
        }

        //notes on problems with spotlight in the editor:
        /*
            instantiating a spotlight creates an Object3d that is the target.
            that target's parent is the scene, but we can make it a child of the spotlight
            when saved to json, the spotlight 

            if shadowcameravisible = true, instantiating a spotlight creates a PerspectiveCamera that is the shadow frustum.  this stops being linked to the location of the light and its target after refresh
            instantiating a spotlight creates a perspectiveCamera that has a rotation decided by the position of the light and its target.
            upon refreshing, the perspective camera can rotate on its own and looks like a shadow frustum, but won't generate shadows.

        */

        










function loadPanorama() {
            

        var mesh;
        var loader = new GSVPANO.PanoLoader();

            function getLatLng(){
                //choose one of these locations
                var locations = [
                    { lat: 39.29533, lng: -76.74360 }
                    // { lat: 51.50700703827454, lng: -0.12791916931155356 },
                    // { lat: 32.6144404, lng: -108.9852017 },
                    // { lat: 39.36382677360614, lng: 8.431220278759724 },
                    // { lat: 59.30571937680209, lng: 4.879402148657164 },
                    // { lat: 28.240385123352873, lng: -16.629988706884774 },
                    // { lat: 50.09072314148827, lng: 14.393133454556278 },
                    // { lat: 41.413416092316275, lng: 2.1531126527786455 },
                    // { lat: 35.69143938066447, lng: 139.695139627539 },
                    // { lat: 35.67120372775569, lng: 139.77167914398797 },
                    // { lat: 54.552083679428065, lng: -3.297380963134742 }
                ];
                var pos = locations[ Math.floor( Math.random() * locations.length ) ];
                var myLatLng = new google.maps.LatLng( pos.lat, pos.lng );
                return myLatLng;
            }


            loader.onProgress = function( p ) {
                //setProgress( p );
            };
            
            loader.onPanoramaData = function( result ) {
                //showProgress( true );
                //showMessage( 'Panorama OK. Loading and composing tiles...' );
            }
            
            loader.onNoPanoramaData = function( status ) {
                //showError("Could not retrieve panorama for the following reason: " + status);
            }
            
            loader.onPanoramaLoad = function() {
                //activeLocation = this.location;
                mesh.material.map = new THREE.Texture( this.canvas ); 
                mesh.material.side = THREE.DoubleSide;
                mesh.material.map.needsUpdate = true;
                //showMessage( 'Panorama tiles loaded.<br/>The images are ' + this.copyright );
                //showProgress( false );






                            onWindowResize();

            };


            //Create the spherical background mesh before we get the panorama attached to it
            mesh = new THREE.Mesh(
                 new THREE.SphereGeometry( 500, 60, 40 ), 
                 new THREE.MeshBasicMaterial({ 
                    map: THREE.ImageUtils.loadTexture( './../../streetview-studio/search.png' ) 
                 }) 
            );

            mesh.position.set(0,editor.config.getKey("floorh"),0);
            mesh.name = "panorama";
            
            editor.addObject(mesh);

            loader.setZoom( 3 );
            //1 is very fuzzy, 2 is fuzzy, 3 is the highest resolution available.  
            //4 Errors occur, possibly because 4 panels don't have resolution 3 available

            loader.load( getLatLng() );



        }

        function deletePanorama(){
            editor.selectById(69)
            removeObject(mesh);
        }














        function setFloorHeight(floorh){
            var cam = {position: [0, floorh, 0],
                target: [1, floorh, 0]};
                editor.config.setKey("camera",cam); 

            editor.config.setKey("floorh",floorh);
        }

        


        function logThings(){

                        editor.scene.traverse(
                            function(child){
                                if(child.parent != undefined){
                                    console.log( child.name+ "\'s parent is " + child.parent.name);
                                }
                            }
                        );
        }


        function raiseThings(amt){

                        editor.scene.traverse(
                            function(child){
                                if(child.parent != undefined && //don't raise the 'scene'
                                     child.name != "ground"){ //don't raise the ground
                                    child.translateY(amt);
                                }
                            }
                        );
        }