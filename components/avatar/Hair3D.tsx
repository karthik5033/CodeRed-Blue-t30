'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { AvatarConfig } from '@/types/avatar-types';

interface Hair3DProps {
    config: AvatarConfig;
}

export default function Hair3D({ config }: Hair3DProps) {
    const { style, color, length, volume } = config.hair;

    // Calculate hair parameters
    const hairLength = length / 100;
    const hairVolume = volume / 100;

    // Hair material
    const hairMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide,
        });
    }, [color]);

    // Render different hair styles
    const renderHairStyle = () => {
        switch (style) {
            case 'short':
            case 'buzz':
                return (
                    <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                        <sphereGeometry args={[1.05, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    </mesh>
                );

            case 'medium':
                return (
                    <group>
                        {/* Main cap */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.08, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                        </mesh>
                        {/* Side layers */}
                        <mesh position={[0, 0.3, 0]} scale={[1.05 * hairVolume, 0.6 * hairLength, 1.05 * hairVolume]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.3]} />
                        </mesh>
                    </group>
                );

            case 'long':
            case 'straight':
                return (
                    <group>
                        {/* Top cap */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.08, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                        </mesh>
                        {/* Long flowing sections */}
                        <mesh position={[-0.6, 0, 0]} rotation={[0, 0, 0.3]} scale={[0.3, 1.5 * hairLength, 0.3 * hairVolume]} material={hairMaterial} castShadow>
                            <cylinderGeometry args={[0.5, 0.3, 2, 16]} />
                        </mesh>
                        <mesh position={[0.6, 0, 0]} rotation={[0, 0, -0.3]} scale={[0.3, 1.5 * hairLength, 0.3 * hairVolume]} material={hairMaterial} castShadow>
                            <cylinderGeometry args={[0.5, 0.3, 2, 16]} />
                        </mesh>
                        {/* Back section */}
                        <mesh position={[0, 0, -0.6]} rotation={[0.3, 0, 0]} scale={[0.6 * hairVolume, 1.5 * hairLength, 0.3]} material={hairMaterial} castShadow>
                            <cylinderGeometry args={[0.5, 0.4, 2, 16]} />
                        </mesh>
                    </group>
                );

            case 'curly':
                return (
                    <group>
                        {/* Base cap */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.1 * hairVolume, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                        </mesh>
                        {/* Curly puffs */}
                        {Array.from({ length: 20 }).map((_, i) => {
                            const angle = (i / 20) * Math.PI * 2;
                            const radius = 0.9;
                            const x = Math.cos(angle) * radius;
                            const z = Math.sin(angle) * radius;
                            const y = 0.5 + Math.random() * 0.3 * hairLength;
                            return (
                                <mesh
                                    key={i}
                                    position={[x, y, z]}
                                    scale={[0.15 * hairVolume, 0.15 * hairVolume, 0.15 * hairVolume]}
                                    material={hairMaterial}
                                    castShadow
                                >
                                    <sphereGeometry args={[1, 8, 8]} />
                                </mesh>
                            );
                        })}
                    </group>
                );

            case 'wavy':
                return (
                    <group>
                        {/* Main volume */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.09, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                        </mesh>
                        {/* Wave sections */}
                        <mesh position={[0, 0.2, 0]} scale={[1.05 * hairVolume, 0.8 * hairLength, 1.05 * hairVolume]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.35]} />
                        </mesh>
                    </group>
                );

            case 'ponytail':
                return (
                    <group>
                        {/* Base */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.06, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                        </mesh>
                        {/* Ponytail */}
                        <mesh position={[0, 0.3, -1]} rotation={[0.5, 0, 0]} scale={[0.2 * hairVolume, 1.2 * hairLength, 0.2 * hairVolume]} material={hairMaterial} castShadow>
                            <cylinderGeometry args={[0.4, 0.25, 2, 16]} />
                        </mesh>
                    </group>
                );

            case 'bun':
                return (
                    <group>
                        {/* Base */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.05, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                        </mesh>
                        {/* Bun */}
                        <mesh position={[0, 1.2, -0.4]} scale={[0.4 * hairVolume, 0.4 * hairVolume, 0.4 * hairVolume]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1, 32, 32]} />
                        </mesh>
                    </group>
                );

            case 'mohawk':
                return (
                    <group>
                        {/* Sides (short) */}
                        <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                            <sphereGeometry args={[1.03, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
                        </mesh>
                        {/* Mohawk strip */}
                        <mesh position={[0, 0.9, 0]} rotation={[0, 0, 0]} scale={[0.3, 0.6 * hairLength, 0.8]} material={hairMaterial} castShadow>
                            <boxGeometry args={[1, 1.5, 1]} />
                        </mesh>
                    </group>
                );

            default:
                return (
                    <mesh position={[0, 0.6, 0]} material={hairMaterial} castShadow>
                        <sphereGeometry args={[1.07, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    </mesh>
                );
        }
    };

    return <group position={[0, 0, 0]}>{renderHairStyle()}</group>;
}
