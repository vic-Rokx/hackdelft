<script lang="ts">
	// Component-level comments
	// TODO: Describe the component.

	// Import statements
	import { onMount } from 'svelte';
	// Libraries
	// Components
	// Types
	type Option = {
		label: string;
		description: string;
		value: string;
	};
	// Stores
	// Transitions

	// Props
	export let value: Option;
	export let options: Option[] = [];
	export let show: boolean = false;

	// Classes and Interfaces
	// TODO: Define Classes and Interfaces.

	// Local variables
	let isClicked = false;
	let selectedOption: any = null;

	// Reactive declarations
	// TODO: Define other reactive variables.

	// Helper Functions
	const handleChange = (event: any) => {
		value = event.target.value;
	};
	const selectOption = (option: any) => {
		selectedOption = option;
		isClicked = true;
		setTimeout(() => (isClicked = false), 250); // Reset after animation
	};

	const confirmSelection = () => {
		show = false;
		value = selectedOption;
	};
	// Lifecycle functions
	onMount(() => {
		// TODO: Add logic for when the component is mounted.
	});

	// Subscriptions
</script>

<!-- JSX/HTML markup -->
<div class="options-container">
	{#if options.length > 1}
		{#each options as option}
			<button type="button" class="option-block" on:click={() => selectOption(option)}>
				<div class="option-icon">
					<!-- <Fa icon={selectedOption?.value === option?.value ? faCheckCircle : faCircle} /> -->
				</div>
				<div class="option-container">
					<div class="option-title" style="color: white;">
						{option?.label}
					</div>
					<div class="option-content" style="color: white;">
						{option?.description}
					</div>
				</div>
				<span
					class="highlight {selectedOption?.value === option?.value && isClicked ? 'active' : ''}"
					style={`background-color: ${isClicked ? '' : 'transparent'}`}
				/>
			</button>
		{/each}
	{/if}
</div>

<!-- <div slot="footer" class="footer-container">
	<button type="button" class="confirm-btn" on:click={confirmSelection}> Confirm </button>
</div> -->

<!-- </select> -->

<!-- SCSS/Styles -->
<style scoped>
	.options-container {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow-y: scroll;
		color: '#fff';
		/* Add other button styles here */
	}
	.option-block {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		border: none;
		border-bottom: 1px solid #e5e5e5;
		font-size: 25px;
		color: '#fff';
		background: transparent;
		position: relative;
		&.active {
			transform: translate(-50%, -50%) scale(1);
		}
	}
	.highlight {
		position: absolute;
		left: -100%; /* Start from outside the left edge */
		width: 100%;
		height: 100%;
		transition: transform 0.25s;
		background-color: #92929213;
		border-radius: 10px;
		pointer-events: none; /* Ignore mouse events */
		color: '#fff';
	}
	.highlight.active {
		transform: translateX(100%); /* Move to the right edge */
	}

	.option-icon {
		background: transparent;
		border: none;
		margin-right: 0px;
		transition: color 0.5s;
		padding-left: 5%;
		color: '#fff';
	}

	.option-container {
		padding: 8px 15px;
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 45px;
		color: '#fff';
	}
	.option-title {
		font-size: 22px;
		margin-bottom: 0px;
		width: fit-content;
		border-radius: 5px;
		color: '#fff';
	}
	.option-content {
		font-size: 12px;
		padding-left: 2px;
		margin-bottom: 0px;
		width: fit-content;
		border-radius: 5px;
		color: '#fff';
	}
	.footer-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.confirm-btn {
		background: #ff621f;
		border: none;
		border-radius: 50px;
		width: 90%;
		height: 100%;
		color: #f8f8f8;
		font-size: 15px;
	}
</style>
