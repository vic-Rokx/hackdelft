<script lang="ts">
	import Select from '$lib/Select.svelte';
	// Component-level comments
	// TODO: Describe the component.

	// Import statements
	import { onMount } from 'svelte';
	// Libraries
	// Components
	// Types
	// Stores
	// Transitions

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	// Classes and Interfaces
	// TODO: Define Classes and Interfaces.

	// Local variables
	// TODO: Define local variables.
	let showProps: boolean = false;
	let selectedProp = {
		label: '',
		description: '',
		value: ''
	};
	let propsArray = [
		{
			label: 'Test 1',
			description: '',
			value: 'Value 1'
		},
		{
			label: 'Test 2',
			description: '',
			value: 'Value 2'
		}
	];
	let promptInput: string = '';

	// Reactive declarations
	// TODO: Define other reactive variables.

	// Helper Functions
	const toggleCategories = (event: any) => {
		event.preventDefault();
		showProps = !showProps;
		// TODO: Implement function.
	};
	// TODO: Define other functions.

	// Lifecycle functions
	onMount(() => {
		// TODO: Add logic for when the component is mounted.
	});

	// Subscriptions
</script>

<!-- JSX/HTML markup -->
<div class="main">
	<!-- <svg
		width="550"
		height="166"
		viewBox="0 0 550 166"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
	>
		<rect width="550" height="166" fill="url(#pattern0_2160_3)" />
		<defs>
			<pattern id="pattern0_2160_3" patternContentUnits="objectBoundingBox" width="1" height="1">
				<use xlink:href="#image0_2160_3" transform="scale(0.00181818 0.0060241)" />
			</pattern>
			<image
				id="image0_2160_3"
				width="550"
				height="166"
				xlink:href="data:image/png;base64,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ERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABERABEZgtAv8fwxtGTzlA+HMAAAAASUVORK5CYII="
			/>
		</defs>
	</svg> -->
	<div class="logo">
		<p style="color:#14a9fF">sea</p>
		<p>salters</p>
		<img src="/logo.png" style="height: 100px; width: 100px;" />
	</div>
	<form class="form-container" method="post">
		<div class="form-element">
			<label class="form-label" for="prompt">Prompt</label>
			<input class="form-input" id="prompt" name="prompt" placeholder="Search a product..." />
		</div>
		{#if showProps}
			<div style="width: 200px;">
				<Select bind:value={selectedProp} options={propsArray} />
			</div>
		{/if}
		<button class="submit-btn" formaction="?/postGpt">Submit</button>
		{#if form?.success && form?.data.length > 0}
			<div>
				{#each form.data as item}
					<div>
						<div
							style="text-overflow: ellipsis; overflow: hidden; max-width: 500px; white-space: nowrap; font-size: 18px; font-weight: 600; font-family: Arial, Helvetica, sans-serif; margin-bottom: 5px; margin-top: 5px;"
						>
							<a href={item.url}>
								{item.name}
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
        <div style="font-size: 18px; font-weight: 600; font-family: Arial, Helvetica, sans-serif; margin-top: 20px;">
            No Results found
        </div>
        {/if}
	</form>
</div>

<!-- SCSS/Styles -->
<style>
	:global(body) {
		/* background-color: #161616; */
		font-family: Arial, Helvetica, sans-serif;
	}

	.logo {
		font-size: 85px;
		font-weight: '700';
		font-family: Copperplate;
		display: flex;
		align-items: center;
	}
	.main {
		height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.form-container {
		width: 60%;
		height: 60%;
		flex-direction: column;
		display: flex;
		align-items: center;
	}

	.form-element {
		display: flex;
		justify-content: center;
		width: 100%;
		flex-direction: column;
		margin-bottom: 40px;
	}
	.form-label {
		font-size: 24px;
		margin-bottom: 5px;
		padding-top: 7%;
		color: #fff;
		width: 100%;
		font-weight: 600;
		font-family: Arial, Helvetica, sans-serif;
	}
	.form-input {
		font-weight: 200;
		padding-top: 2%;
		padding-bottom: 2%;
		padding-left: 2%;
		padding-right: 2%;
		font-size: 14px;
		border-radius: 8px;
		/* border: 1px solid lightgray; */
		border: none;
		color: #fff;
		background-color: #212121;
		&:focus {
			outline: none;
		}
	}

	.submit-btn {
		width: 40%;
		background: #212121;
		padding: 15px 15px;
		border-radius: 50px;
		border: none;
		color: #f8f8f8;
		font-weight: 300;
		/* position: absolute; */
		/* bottom: 30px; */

		&:hover {
			background: #14a9ff;
			transition: background 0.5s;
			cursor: pointer;
		}
	}

	.prop-btn {
		width: 20%;
		background: #212121;
		padding: 10px 15px;
		border-radius: 50px;
		border: none;
		color: #f8f8f8;
		font-weight: 300;
	}
	/* TODO: Add component styles */
</style>
