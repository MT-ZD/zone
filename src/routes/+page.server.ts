import { DateTime } from 'luxon';
import type { PageServerLoad } from './$types';
import { lookup } from 'fast-geoip';

export const load = (async (params) => {
	const zone = params.url.searchParams.get('zone');
	const time = params.url.searchParams.get('time');

	const geo = await lookup(params.getClientAddress());

	const theirTime = time
		? DateTime.fromFormat(time, 'HH:mm', {
				zone: zone ?? 'UTC'
		  })
		: DateTime.fromJSDate(new Date());

	const yourTimeServer = theirTime.setZone(geo?.timezone ?? 'UTC');

	return {
		theirTime: theirTime.toISO(),
		yourTimeServer: yourTimeServer.toISO()
	};
}) satisfies PageServerLoad;
