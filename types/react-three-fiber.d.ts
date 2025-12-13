// Global type declarations for React Three Fiber
// This file extends JSX.IntrinsicElements with Three.js components

// For old JSX transform
declare namespace JSX {
    interface IntrinsicElements {
        // Lights
        ambientLight: any
        directionalLight: any
        pointLight: any
        spotLight: any
        hemisphereLight: any

        // Meshes and Groups
        mesh: any
        group: any

        // Geometries
        boxGeometry: any
        sphereGeometry: any
        cylinderGeometry: any
        planeGeometry: any
        capsuleGeometry: any
        torusGeometry: any
        coneGeometry: any
        circleGeometry: any

        // Materials
        meshStandardMaterial: any
        meshBasicMaterial: any
        meshPhysicalMaterial: any
        meshPhongMaterial: any
        meshLambertMaterial: any

        // Scene
        scene: any

        // Cameras
        perspectiveCamera: any
        orthographicCamera: any
    }
}

// For new JSX transform (React 17+)
declare namespace React.JSX {
    interface IntrinsicElements {
        // Lights
        ambientLight: any
        directionalLight: any
        pointLight: any
        spotLight: any
        hemisphereLight: any

        // Meshes and Groups
        mesh: any
        group: any

        // Geometries
        boxGeometry: any
        sphereGeometry: any
        cylinderGeometry: any
        planeGeometry: any
        capsuleGeometry: any
        torusGeometry: any
        coneGeometry: any
        circleGeometry: any

        // Materials
        meshStandardMaterial: any
        meshBasicMaterial: any
        meshPhysicalMaterial: any
        meshPhongMaterial: any
        meshLambertMaterial: any

        // Scene
        scene: any

        // Cameras
        perspectiveCamera: any
        orthographicCamera: any
    }
}
