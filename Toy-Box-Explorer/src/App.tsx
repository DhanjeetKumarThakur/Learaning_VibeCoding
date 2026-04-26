/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameScene } from './components/Game/GameScene';
import { Overlay } from './components/UI/Overlay';

export default function App() {
  return (
    <div className="relative w-full h-full">
      <GameScene />
      <Overlay />
    </div>
  );
}

