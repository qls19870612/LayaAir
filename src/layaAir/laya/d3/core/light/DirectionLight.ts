import { Vector3 } from "../../math/Vector3";
import { ShaderData } from "../../shader/ShaderData";
import { ShadowMap } from "../../shadowMap/ParallelSplitShadowMap";
import { Scene3D } from "../scene/Scene3D";
import { Scene3DShaderDeclaration } from "../scene/Scene3DShaderDeclaration";
import { LightSprite, LightType } from "./LightSprite";
import { ShadowMode } from "./ShadowMode";

/**
 * <code>DirectionLight</code> 类用于创建平行光。
 */
export class DirectionLight extends LightSprite {
	/**@iternal */
	_direction: Vector3;

	/**
	* @inheritDoc
	* @override
	*/
	get shadowMode(): ShadowMode {
		return this._shadowMode;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	set shadowMode(value: ShadowMode) {
		if (this._shadowMode !== value) {
			this._shadowMode = value;
			(this.scene) && (this._initShadow());
		}
	}

	/**
	 * 创建一个 <code>DirectionLight</code> 实例。
	 */
	constructor() {
		super();
		this._direction = new Vector3();
		this._lightType = LightType.Directional;
	}


	/**
	 * @internal
	 */
	private _initShadow(): void {
		if (this._shadowMode !== ShadowMode.None) {
			this._parallelSplitShadowMap = new ShadowMap();
			this.transform.worldMatrix.getForward(this._direction);
			Vector3.normalize(this._direction, this._direction);
			this._parallelSplitShadowMap.setInfo(this.scene, this._shadowFarPlane, this._direction, this._shadowMapSize, this._shadowMapCount, 0);//TODO:
		} else {
			var defineDatas: ShaderData = (<Scene3D>this._scene)._shaderValues;
			this._parallelSplitShadowMap.disposeAllRenderTarget();
			this._parallelSplitShadowMap = null;
			defineDatas.removeDefine(Scene3DShaderDeclaration.SHADERDEFINE_SHADOW_PSSM1);
			defineDatas.removeDefine(Scene3DShaderDeclaration.SHADERDEFINE_SHADOW_PSSM2);
			defineDatas.removeDefine(Scene3DShaderDeclaration.SHADERDEFINE_SHADOW_PSSM3);
		}
	}

	/**
	 * @internal
	 * @override
	 */
	protected _addToLightQueue(): void {
		(<Scene3D>this._scene)._directionLights.add(this);
	}

	/**
	 * @internal
	 * @override
	 */
	protected _removeFromLightQueue(): void {
		(<Scene3D>this._scene)._directionLights.remove(this);
	}
}

