<script lang="ts">
	import { consonantNotes, vowelKey } from '#lib/terms';
</script>

<div class="key" id="key">
	<h2>How to read the letters</h2>
	<table>
		<caption class="visually-hidden">Vowels</caption>
		<thead>
			<tr>
				<th>Letter</th>
				<th>Say</th>
				<th>As in</th>
			</tr>
		</thead>
		<tbody>
			{#each vowelKey as row (row.mark)}
				<tr>
					<td lang="pi">{row.mark}</td>
					<td>{row.hint}</td>
					<td>{row.asIn}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<h3>Consonants and stress</h3>
	<ul>
		{#each consonantNotes as note, index (index)}
			<li>{note}</li>
		{/each}
	</ul>
</div>
