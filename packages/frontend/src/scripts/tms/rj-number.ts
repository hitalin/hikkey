/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type VNode, h } from 'vue';
import TmsRjNumber from '@/components/TmsRjNumber.vue';

class RjNumber {
	public static readonly WORK_SYMBOL = Symbol();
	public static readonly WORK_REGEX = /[RVB][JE]\d{6,}/g;
	public static getWorkUrl(rj: string): string {
			return `https://www.dlsite.com/home/work/=/product_id/${rj}.html`;
	}

	public static readonly CIRCLE_SYMBOL = Symbol();
	public static readonly CIRCLE_REGEX = /[RVB][G]\d{5,}/g;
	public static getCircleUrl(rg: string): string {
			return `https://www.dlsite.com/home/circle/profile/=/maker_id/${rg}.html`;
	}

	// nicovideo
	public static readonly NICO_SYMBOL = Symbol();
	public static readonly NICO_REGEX = /sm\d+/g;
	public static getNicoUrl(sm: string): string {
			return `https://www.nicovideo.jp/watch/${sm}`;
	}

	// JVN
	public static readonly JVN_SYMBOL = Symbol();
	public static readonly JVN_REGEX = /JVN\d{8}/g;
	public static getJvnUrl(jvn: string): string {
			return `https://jvn.jp/jp/${jvn}/index.html`;
	}

	// JVNVU
	public static readonly JVNVU_SYMBOL = Symbol();
	public static readonly JVNVU_REGEX = /JVNVU\d{8}/g;
	public static getJvnVuUrl(jvnvu: string): string {
			return `https://jvn.jp/vu/${jvnvu}/index.html`;
	}

	// JVNTA
	public static readonly JVNTA_SYMBOL = Symbol();
	public static readonly JVNTA_REGEX = /JVNTA\d{8}/g;
	public static getJvnTaUrl(jvnta: string): string {
			return `https://jvn.jp/ta/${jvnta}/index.html`;
	}

	// JVNDB
	public static readonly JVNDB_SYMBOL = Symbol();
	public static readonly JVNDB_REGEX = /JVNDB-\d{4}-\d{6}/g;
	public static getJvnDbUrl(jvndb: string): string {
			const year = jvndb.match(/\d{4}/)![0];
			return `https://jvndb.jvn.jp/en/contents/${year}/${jvndb}.html`;
	}
}

type ParsedNode = {
	readonly type: 'text' | typeof RjNumber.WORK_SYMBOL | typeof RjNumber.CIRCLE_SYMBOL | typeof RjNumber.NICO_SYMBOL | typeof RjNumber.JVN_SYMBOL | typeof RjNumber.JVNVU_SYMBOL | typeof RjNumber.JVNTA_SYMBOL | typeof RjNumber.JVNDB_SYMBOL;
	readonly value: string;
};

const parseNodes = (parsedNodes: ParsedNode[], type: ParsedNode['type'], regexp: RegExp): ParsedNode[] => {
	return parsedNodes.flatMap((node) => {
			if (node.type !== 'text') return node;

			const matches = node.value.match(regexp);
			if (matches == null) return node;

			const result: ParsedNode[] = [];
			let currentIndex = 0;

			matches.forEach((match) => {
					const index = node.value.indexOf(match, currentIndex);
					if (index > currentIndex) {
							result.push({
									type: 'text' as const,
									value: node.value.substring(currentIndex, index),
							});
					}
					result.push({ type, value: match });
					currentIndex = index + match.length;
			});

			if (currentIndex < node.value.length) {
					result.push({
							type: 'text' as const,
							value: node.value.substring(currentIndex, node.value.length),
					});
			}

			return result;
	});
};
