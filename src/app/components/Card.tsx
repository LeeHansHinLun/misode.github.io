import type { ComponentChildren } from 'preact'

interface Props {
	title?: ComponentChildren,
	link?: string,
	overlay?: ComponentChildren,
	children?: ComponentChildren,
}
export function Card({ title, overlay, link, children }: Props) {
	const content = <>
		{overlay && <span class="card-overlay">{overlay}</span>}
		<div class="card-content">
			{title && <h3 class="card-title">{title}</h3>}
			{children}
		</div>
	</>

	return link === undefined
		?	<div class="card">{content}</div>
		: <a class="card" href={link} >{content}</a>
}
