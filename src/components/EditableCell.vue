<template>
	<div @click="onFieldClick" class="edit-cell">
		<el-tooltip v-if="!editMode && !showInput"  :placement="toolTipPlacement" :open-delay="toolTipDelay" :content="toolTipContent">
			<div tabindex="0" @keyup.enter="onFieldClick">
				<slot name="content"></slot>
			</div>
		</el-tooltip>
		<component :is="editableComponent" v-if="editMode || showInput" ref="input" minlength="1" :maxlength="maxLength" :min="1" placeholder="请输入内容" show-word-limit @keyup.enter.native="onInputExit" v-on="listeners" v-bind="$attrs" v-model="model">
			<slot name="edit-component-slot"></slot>
		</component>
	</div>
</template>
<script>
	export default {
		name: "editable-cell",
		inheritAttrs: false,
		props: {
			value: {
				type: String,
				default: "",
				require:true
			},
			toolTipContent: {
				type: String,
				default: "点我编辑"
			},
			toolTipDelay: {
				type: Number,
				default: 500
			},
			toolTipPlacement: {
				type: String,
				default: "top-start"
			},
			showInput: {
				type: Boolean,
				default: false
			},
			editableComponent: {
				type: String,
				default: "el-input"
			},
			closeEvent: {
				type: String,
				default: "blur"
			},
			maxLength:{
				type:Number,
				default: 20,
				required:false
			},
			validateFun:{//字段验证
				type:Function,
				required:false
			}
		},
		data() {
			return {
				editMode: true
			};
		},
		computed: {
			model: {
				get() {
					if(isNaN(this.value)){
						return this.value.toString().trim();
					}else{
						return this.value;
					}
				},
				set(val) {
					if(isNaN(val)){
						this.$emit("input", val.toString().trim());	
					}else{
						this.$emit("input", val);
					}
				}
			},
			listeners() {
				return {
					[this.closeEvent]: this.onInputExit,
					...this.$listeners
				};
			}
		},
		mounted(){
		},
		methods: {
			onFieldClick() {
				this.editMode = true;
				this.$nextTick(() => {
					let inputRef = this.$refs.input;
					if(inputRef) {
						inputRef.focus();
					}
				});
			},
			onInputExit(val) {
				let inputValue = val.target.value.toString().trim();
				let isCheckPass = true;

				if(this.validateFun!=null && this.validateFun !=undefined){
					isCheckPass = this.validateFun(inputValue);
				}else{
					if(inputValue.length == 0){
						this.$message({
							type: 'warning',
							message: '输入内容不能为空!'
						});
						isCheckPass = false;
					}
				}
				if(val.currentTarget.ariaValueNow !=null){
					isCheckPass = false;
				}
				if(isCheckPass){
					this.editMode = false;	
				}
			},
			onInputChange(val) {
				if(val.currentTarget.value.toString().trim().length == 0){
					this.$message({
						type: 'warning',
						message: '输入内容不能为空!'
					});
					this.editMode = true;
					return;
				}
				this.$emit("input", val);
			}
		}
	};
</script>
<style>

</style>