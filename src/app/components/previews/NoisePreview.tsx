import { useEffect, useRef, useState } from 'preact/hooks'
import { useLocale } from '../../contexts/index.js'
import { useCanvas } from '../../hooks/index.js'
import { normalNoise } from '../../previews/index.js'
import { randomSeed } from '../../Utils.js'
import { Btn } from '../index.js'
import type { PreviewProps } from './index.js'

export const NoisePreview = ({ data, shown, version }: PreviewProps) => {
	const { locale } = useLocale()
	const [seed, setSeed] = useState(randomSeed())
	const [scale, setScale] = useState(2)
	const offset = useRef<[number, number]>([0, 0])
	const state = JSON.stringify([data])

	const { canvas, redraw } = useCanvas({
		size() {
			return [256, 256]
		},
		async draw(img) {
			const options = { offset: offset.current, scale, seed, version }
			normalNoise(data, img, options)
		},
		async onDrag(dx, dy) {
			offset.current[0] = offset.current[0] + dx * 256
			offset.current[1] = offset.current[1] + dy * 256
			redraw()
		},
	}, [version, state, scale, seed])

	useEffect(() => {
		if (shown) {
			redraw()
		}
	}, [version, state, scale, seed, shown])

	const changeScale = (newScale: number) => {
		offset.current[0] = offset.current[0] * scale / newScale
		offset.current[1] = offset.current[1] * scale / newScale
		setScale(newScale)
	}

	return <>
		<div class="controls preview-controls">
			<Btn icon="dash" tooltip={locale('zoom_out')}
				onClick={() => changeScale(scale * 1.5)} />
			<Btn icon="plus" tooltip={locale('zoom_in')}
				onClick={() => changeScale(scale / 1.5)} />
			<Btn icon="sync" tooltip={locale('generate_new_seed')}
				onClick={() => setSeed(randomSeed())} />
		</div>
		<canvas ref={canvas} width="256" height="256"></canvas>
	</>
}
