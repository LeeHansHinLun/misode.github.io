import { useMemo, useState } from 'preact/hooks'
import { useLocale } from '../../contexts/index.js'
import { useAsync } from '../../hooks/useAsync.js'
import type { VersionMeta } from '../../services/index.js'
import { fetchChangelogs, getArticleLink } from '../../services/index.js'
import { Giscus } from '../Giscus.js'
import { Octicon } from '../Octicon.js'
import { ChangelogList } from './ChangelogList.js'
import { VersionMetaData } from './index.js'

type Tab = 'changelog' | 'discussion' 

interface Props {
	id: string,
	version?: VersionMeta,
}
export function VersionDetail({ id, version }: Props) {
	const { locale } = useLocale()

	const [tab, setTab] = useState<Tab>('changelog')

	const { value: changes } = useAsync(fetchChangelogs, [])

	const filteredChangelogs = useMemo(() =>
		changes?.filter(c => c.version === id || c.group === id),
	[id, changes])

	const articleLink = version && getArticleLink(version.id)

	return <>
		<div class="version-detail">
			<h2>{version?.name ?? id}</h2>
			<div class="version-info">
				{version ? <>
					<VersionMetaData label={locale('versions.released')} value={releaseDate(version)} />
					{version.release_target !== null && <VersionMetaData label={locale('versions.release_target')} value={version.release_target} link={version.id !== version.release_target ? `/versions/?id=${version.release_target}` : undefined} />}
					<VersionMetaData label={locale('versions.data_version')} value={version.data_version} />
					<VersionMetaData label={locale('versions.protocol_version')} value={version.protocol_version} />
					<VersionMetaData label={locale('versions.data_pack_format')} value={version.data_pack_version} />
					<VersionMetaData label={locale('versions.resource_pack_format')} value={version.resource_pack_version} />
				</> : filteredChangelogs?.length ?? 0 > 1 ? <p>
					This version is not released yet.
				</p> : <p>
					This version does not exist. Only versions since 1.14 are tracked, or it may be too recent.
				</p>}
			</div>
			<div class="version-tabs">
				<span class={tab === 'changelog' ? 'selected' : ''} onClick={() => setTab('changelog')}>{locale('versions.technical_changes')}</span>
				<span class={tab === 'discussion' ? 'selected' : ''} onClick={() => setTab('discussion')}>{locale('versions.discussion')}</span>
				{articleLink && <a href={articleLink} target="_blank">
					{locale('versions.article')}
					{Octicon.link_external}
				</a>}
			</div>
			<div class="version-tab">
				{tab === 'changelog' && <ChangelogList changes={filteredChangelogs} defaultOrder="asc" />}
				{tab === 'discussion' && <Giscus term={`version/${id}/`} />}
			</div>
		</div>
	</>
}

export function releaseDate(version: VersionMeta) {
	return new Date(version.release_time).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
