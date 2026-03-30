export type Locale = 'zh' | 'en';

export const translations = {
  // ─── Global / App ───
  appName: { zh: '零库存餐饮生产管理系统', en: 'Zero Stock' },
  todayIs: { zh: '今天是：', en: 'Today is: ' },
  pageNotFound: { zh: '页面未找到', en: 'Page not found' },
  footer: {
    zh: '零库存餐饮生产管理系统 ©{year}',
    en: 'Zero Stock ©{year}',
  },

  // ─── Navigation ───
  navHome: { zh: '首页', en: 'Home' },
  navMeals: { zh: '菜谱安排', en: 'Meals' },
  navCensus: { zh: '人数统计', en: 'Census' },
  navProcurement: { zh: '采购管理', en: 'Procurement' },
  navProcurementOrder: { zh: '采购单', en: 'Procurement Order' },
  navReceivingOrder: { zh: '收货单', en: 'Receiving Order' },
  navProcessing: { zh: '加工管理', en: 'Processing' },
  navDishes: { zh: '菜品管理', en: 'Dishes' },
  navMaterials: { zh: '原料管理', en: 'Materials' },
  navCreateMaterial: { zh: '新建原料', en: 'Create Material' },
  navCreateSupplier: { zh: '新建供应商', en: 'Create Supplier' },
  navSupplierDetail: { zh: '供应商详情', en: 'Supplier Detail' },

  // ─── Common ───
  save: { zh: '保存', en: 'Save' },
  cancel: { zh: '取消', en: 'Cancel' },
  edit: { zh: '编辑', en: 'Edit' },
  delete: { zh: '删除', en: 'Delete' },
  yes: { zh: '是', en: 'Yes' },
  no: { zh: '否', en: 'No' },
  none: { zh: '无', en: 'None' },
  commonId: { zh: '编号', en: 'ID' },
  commonName: { zh: '名称', en: 'Name' },
  commonCategory: { zh: '类别', en: 'Category' },
  commonUnit: { zh: '单位', en: 'Unit' },
  commonContactPerson: { zh: '联系人', en: 'Contact Person' },
  commonPhone: { zh: '电话', en: 'Phone' },
  commonAddress: { zh: '地址', en: 'Address' },
  commonSupplier: { zh: '供应商', en: 'Supplier' },
  commonSelectMaterial: { zh: '选择原料', en: 'Select material' },
  commonTotal: { zh: '合计', en: 'Total' },
  commonRegenerate: { zh: '重新生成加工单', en: 'Regenerate' },
  commonYieldRate: { zh: '出成率', en: 'Yield Rate' },
  commonSpecs: { zh: '加工规格', en: 'Specs' },
  commonAction: { zh: '操作', en: 'Action' },
  commonOperation: { zh: '操作', en: 'Operation' },
  commonExportPdf: { zh: '导出 PDF / 打印', en: 'Export PDF / Print' },

  // ─── Dish Module ───
  dishListTitle: { zh: '菜品制作单', en: 'Dish Recipe Sheet' },
  dishSearchName: { zh: '搜索菜品名', en: 'Search dish' },
  dishSearchIngredient: { zh: '按原料筛选', en: 'Filter ingredient' },
  dishCreate: { zh: '新建菜品', en: 'New Dish' },
  dishColName: { zh: '品名', en: 'Dish Name' },
  dishColIngredients: { zh: '食材 (g)', en: 'Ingredients (g)' },
  dishColSeasonings: { zh: '调料 (g)', en: 'Seasonings (g)' },
  dishColCookingMethod: { zh: '具体制作工艺', en: 'Cooking Method' },
  dishDeleteConfirm: {
    zh: '确定要删除这个菜品吗？',
    en: 'Are you sure you want to delete this dish?',
  },
  dishDeleteFailed: { zh: '删除菜品失败', en: 'Failed to delete dish' },
  dishSaveFailed: { zh: '保存菜品失败', en: 'Failed to save dish' },
  dishLoadFailed: { zh: '加载菜品失败', en: 'Failed to load dishes' },
  dishUpdated: { zh: '菜品已更新', en: 'Dish updated' },
  dishCreated: { zh: '菜品已创建', en: 'Dish created' },
  dishDeleted: { zh: '菜品已删除', en: 'Dish deleted' },
  dishEditTitle: { zh: '编辑菜品', en: 'Edit Dish' },
  dishNameLabel: { zh: '菜品名', en: 'Dish Name' },
  dishNameRequired: { zh: '请输入菜品名', en: 'Please enter dish name' },
  dishNamePlaceholder: {
    zh: '例如：西红柿打卤面',
    en: 'e.g. Tomato Noodle Soup',
  },
  dishIngredientLabel: { zh: '食材物料', en: 'Ingredients' },
  dishNoMaterial: {
    zh: '⚠ 暂无原料数据，请先在原料管理页面添加原料',
    en: '⚠ No materials found. Please add materials first.',
  },
  dishNoMaterialData: { zh: '无原料数据', en: 'No materials' },
  dishSelectProcessing: { zh: '加工方式', en: 'Processing' },
  dishNoProcessing: { zh: '无加工规格', en: 'No processing' },
  dishWeightPlaceholder: { zh: '重量(g)', en: 'Weight(g)' },
  dishWeightRequired: { zh: '输入克重', en: 'Enter weight' },
  dishAddIngredient: { zh: '添加食材', en: 'Add Ingredient' },
  dishSeasoningsRequired: { zh: '请填写调料', en: 'Please enter seasonings' },
  dishSeasoningsPlaceholder: { zh: '盐2g, 糖1g', en: 'Salt 2g, Sugar 1g' },
  dishCookingMethodRequired: {
    zh: '请填写制作工艺',
    en: 'Please enter cooking method',
  },
  dishCookingMethodPlaceholder: {
    zh: '1. 去皮前膀加盐煎至两面金黄\n2. 炒西红柿',
    en: '1. Pan-fry with salt until golden\n2. Stir-fry tomatoes',
  },

  // ─── Meal Module ───
  mealBoardTitle: {
    zh: '标准菜谱安排',
    en: 'Standard Cycle Meals',
  },
  mealPrintTitle: { zh: '标准菜谱', en: 'Standard Meals' },
  mealConfigSheet: { zh: '配料表', en: 'Recipe Sheet' },
  day1: { zh: '周一', en: 'Mon' },
  day2: { zh: '周二', en: 'Tue' },
  day3: { zh: '周三', en: 'Wed' },
  day4: { zh: '周四', en: 'Thu' },
  day5: { zh: '周五', en: 'Fri' },
  day6: { zh: '周六', en: 'Sat' },
  day7: { zh: '周日', en: 'Sun' },
  mealNewDietPlaceholder: { zh: '新套餐名称', en: 'New diet name' },
  mealAddDiet: { zh: '添加', en: 'Add' },
  mealDietCreated: { zh: '套餐类别已创建', en: 'Diet category created' },
  mealDietCreateFailed: {
    zh: '创建套餐类别失败',
    en: 'Failed to create diet category',
  },
  mealDietRenamed: { zh: '套餐类别已重命名', en: 'Diet category renamed' },
  mealDietRenameFailed: { zh: '重命名失败', en: 'Rename failed' },
  mealDietDeleted: { zh: '套餐类别已删除', en: 'Diet category deleted' },
  mealDietDeleteFailed: { zh: '删除失败', en: 'Delete failed' },
  mealRenameTitle: { zh: '重命名套餐类别', en: 'Rename Diet Category' },
  mealRenameInput: { zh: '输入新名称', en: 'Enter new name' },
  mealDeleteConfirm: { zh: '确认删除', en: 'Confirm Delete' },
  mealDeleteConfirmContent: {
    zh: '确定要删除套餐类别「{name}」吗？该类别下的所有菜单数据也将被删除。',
    en: 'Are you sure you want to delete diet category "{name}"? All menu data under this category will also be deleted.',
  },
  mealSaved: { zh: '菜单已保存', en: 'Menu saved' },
  mealSaveFailed: { zh: '保存菜单失败', en: 'Failed to save menu' },
  mealLoadDietsFailed: {
    zh: '加载套餐类别失败',
    en: 'Failed to load diet categories',
  },
  mealLoadMenuFailed: {
    zh: '加载周菜单失败',
    en: 'Failed to load weekly menu',
  },
  mealLoadDishesFailed: { zh: '加载菜品列表失败', en: 'Failed to load dishes' },
  mealUnknownDiet: { zh: '未知套餐', en: 'Unknown Diet' },
  mealBreakfast: { zh: '早餐', en: 'Breakfast' },
  mealLunch: { zh: '午餐', en: 'Lunch' },
  mealDinner: { zh: '晚餐', en: 'Dinner' },
  mealEditTitle: { zh: '编辑 {day} 食谱', en: 'Edit {day} Menu' },
  mealEditTitleGeneric: { zh: '编辑食谱', en: 'Edit Menu' },
  mealSelectDish: { zh: '选择菜品', en: 'Select dish' },
  mealSelectDishRequired: { zh: '请选择菜品', en: 'Please select a dish' },
  mealNoDishes: { zh: '暂无菜品', en: 'No dishes' },
  mealAddDish: { zh: '添加菜品', en: 'Add Dish' },
  mealNoDietTitle: { zh: '暂无套餐类别', en: 'No Diet Categories' },
  mealNoDietDesc: {
    zh: '请先添加一个套餐类别开始制定菜单',
    en: 'Please add a diet category to start planning menus',
  },

  // ─── Supplier Module ───
  supplierListTitle: { zh: '供应商列表', en: 'Supplier List' },
  supplierSearchName: { zh: '搜索供应商名', en: 'Search supplier name' },
  supplierDetail: { zh: '详情', en: 'Detail' },
  supplierDeleteConfirm: {
    zh: '确定删除该供应商吗？',
    en: 'Are you sure to delete this supplier?',
  },
  supplierDeleted: { zh: '供应商已删除', en: 'Supplier deleted' },
  supplierUpdated: { zh: '供应商已更新', en: 'Supplier updated' },

  supplierCreateErrorId: {
    zh: '获取创建的供应商 ID 失败。',
    en: 'Error retrieving created supplier ID.',
  },
  supplierCreateErrorMaterial: {
    zh: '无法添加原料',
    en: 'Failed to add material',
  },
  supplierCreated: { zh: '供应商已创建', en: 'Supplier created' },
  supplierCreateFailed: {
    zh: '创建供应商失败',
    en: 'Failed to create supplier',
  },
  supplierBasicInfo: { zh: '基础信息', en: 'Basic Information' },
  supplierRequired: { zh: '必填', en: 'Required' },
  supplierNamePlaceholder: { zh: '供应商名称', en: 'Supplier name' },
  supplierContactPlaceholder: { zh: '联系人名称', en: 'Contact person name' },
  supplierPhonePlaceholder: { zh: '电话号码', en: 'Phone number' },
  supplierMaterialDetails: { zh: '原料明细', en: 'Material Details' },
  supplierMaterialDetailsDesc: {
    zh: '可选。您可以在此处添加原料，或稍后在供应商详情页中进行编辑。',
    en: 'Optional. You can add materials now, or edit later in the supplier detail page.',
  },
  supplierMaterial: { zh: '原料', en: 'Material' },
  supplierPrice: { zh: '单价', en: 'Price' },
  supplierUnitSpec: { zh: '单位（规格）', en: 'Unit (Spec)' },
  supplierKgPerUnit: { zh: '千克/单位', en: 'kg/unit' },
  supplierPricePlaceholder: { zh: '例如：12.5', en: 'e.g. 12.5' },
  supplierUnitPlaceholder: { zh: '例如：箱 / 袋', en: 'e.g. 箱 / 袋' },
  supplierUnitPlaceholderKg: {
    zh: '例如：箱 / 袋 / kg',
    en: 'e.g. 箱 / 袋 / kg',
  },
  supplierKgPlaceholder: { zh: '例如：10', en: 'e.g. 10' },

  supplierNotFound: { zh: '未找到供应商', en: 'Supplier not found' },
  supplierBack: { zh: '返回', en: 'Back' },
  supplierEdit: { zh: '编辑供应商', en: 'Edit Supplier' },

  supplierMaterialsTitle: { zh: '供应商原料', en: 'Supplier Materials' },
  supplierSearchMaterial: {
    zh: '按原料 ID 或名称搜索',
    en: 'Search by Material ID or Name',
  },
  supplierAddMaterial: { zh: '添加原料', en: 'Add Material' },
  supplierMaterialNotes: { zh: '备注', en: 'Notes' },
  supplierMaterialActions: { zh: '操作', en: 'Actions' },
  supplierMaterialUpdated: { zh: '已更新', en: 'Updated' },
  supplierMaterialAdded: { zh: '已添加', en: 'Added' },

  supplierEditMaterialTitle: {
    zh: '编辑供应商原料',
    en: 'Edit Supplier Material',
  },
  supplierAddMaterialTitle: {
    zh: '添加供应商原料',
    en: 'Add Supplier Material',
  },
  supplierMaterialDuplicateError: {
    zh: '该供应商已存在此原料。',
    en: 'This material already exists for this supplier.',
  },

  // ─── Census Module ───
  censusListTitle: { zh: '人数统计表', en: 'Census Table' },
  censusListSubtitle: {
    zh: '按区域查看各餐次人数，可切换为整表编辑模式。',
    en: 'Review headcounts by region and meal, then switch into full-table edit mode.',
  },
  censusRegionColumn: { zh: '区域', en: 'Region' },
  censusSaved: { zh: '人数统计已保存', en: 'Census updated' },
  censusSaveFailed: { zh: '保存人数统计失败', en: 'Failed to save census' },

  // ─── Processing Module ───
  processingListTitle: { zh: '加工单', en: 'Processing' },
  processingGenerate: { zh: '生成加工单', en: 'Generate' },
  processingGenerated: {
    zh: '加工单已生成',
    en: 'Processing generated successfully.',
  },
  processingMaterialNameColumn: { zh: '原料名称', en: 'Material Name' },
  processingMethodColumn: { zh: '加工方式', en: 'Processing Method' },
  processingRequirementColumn: { zh: '加工要求', en: 'Requirement' },
  processingTimeColumn: { zh: '加工时间', en: 'Processing Time' },
  processingNoItems: { zh: '暂无明细', en: 'No items.' },
  processingNoData: {
    zh: '暂无数据，请先点击生成',
    en: 'No data. Click Generate.',
  },
  // ─── Procurement Module ───
  procurementGenerate: { zh: '生成采购单', en: 'Generate' },
  procurementSubmit: { zh: '确认采购单', en: 'Submit' },

  procurementGenerateSuccess: {
    zh: '采购单已生成',
    en: 'Procurement generated',
  },
  procurementRegenerateSuccess: {
    zh: '采购单已重新生成',
    en: 'Procurement regenerated',
  },
  procurementSubmitSuccess: {
    zh: '采购单已确认',
    en: 'Procurement submitted',
  },
  procurementSupplierUpdated: {
    zh: '供应商已更新',
    en: 'Supplier updated',
  },

  procurementNoData: {
    zh: '暂无采购单，请先点击生成采购单',
    en: 'No procurement order yet. Please click Generate first.',
  },
  procurementNoItems: {
    zh: '暂无采购单明细',
    en: 'No procurement items',
  },
  receivingNoData: {
    zh: '暂无可收货的采购单，请先确认采购单',
    en: 'No receivable procurement order yet. Please submit procurement first.',
  },
  receivingNoItems: {
    zh: '暂无收货单明细',
    en: 'No receiving items',
  },

  procurementColName: { zh: '品名', en: 'Name' },
  procurementColCategory: { zh: '规格/类别', en: 'Category' },
  procurementColDemandKg: { zh: '需求(kg)', en: 'Demand (kg)' },
  procurementColDemandUnit: {
    zh: '需求(特殊单位)',
    en: 'Demand (Unit)',
  },
  procurementColStockKg: { zh: '库存(kg)', en: 'Stock (kg)' },
  procurementColStockUnit: {
    zh: '库存(特殊单位)',
    en: 'Stock (Unit)',
  },
  procurementColPurchaseKg: {
    zh: '采购需求(kg)',
    en: 'Purchase (kg)',
  },
  procurementColPurchaseUnit: {
    zh: '采购需求(特殊单位)',
    en: 'Purchase (Unit)',
  },
  procurementColSupplierUnit: {
    zh: '供应商单位',
    en: 'Supplier Unit',
  },
  procurementColSupplierKgPerUnit: {
    zh: 'kg/单位',
    en: 'kg/unit',
  },
  procurementColSupplierPrice: { zh: '价格', en: 'Price' },

  procurementEditSupplierTitle: {
    zh: '编辑供应商',
    en: 'Edit Supplier',
  },
  procurementEditSupplierDesc: {
    zh: '请选择该原料的供应商。',
    en: 'Please select one supplier for this material.',
  },
  procurementNoAvailableSuppliers: {
    zh: '暂无可选供应商',
    en: 'No available suppliers',
  },

  procurementExportTitle: {
    zh: '导出 / 打印采购单',
    en: 'Export / Print Procurement Order',
  },
  procurementExportConfirm: {
    zh: '是否先重新生成采购单，确保导出内容为最新？',
    en: 'Do you want to regenerate the procurement first to make sure the exported content is up to date?',
  },
  procurementExportDirectly: {
    zh: '直接导出 / 打印',
    en: 'Export / Print Directly',
  },
  procurementExportRegenerateFirst: {
    zh: '先重新生成',
    en: 'Regenerate First',
  },

  procurementPrintWindowFailed: {
    zh: '打开打印窗口失败，请检查浏览器拦截设置',
    en: 'Failed to open print window, please check browser popup blocker',
  },
  procurementRegenerateBlockedSubmitted: {
    zh: '采购单已确认，无法重新生成',
    en: 'Procurement order already submitted, cannot regenerate',
  },
  procurementRegenerateFailed: {
    zh: '重新生成采购单失败',
    en: 'Failed to regenerate procurement order',
  },

  receivingColExpectedKg: { zh: '应收(kg)', en: 'Expected (kg)' },
  receivingColExpectedUnit: {
    zh: '应收(特殊单位)',
    en: 'Expected (Unit)',
  },
  receivingColActualKg: { zh: '实收(kg)', en: 'Actual (kg)' },
  receivingColActualUnit: {
    zh: '实收(特殊单位)',
    en: 'Actual (Unit)',
  },
  receivingSubmitSuccess: {
    zh: '收货单已提交',
    en: 'Receiving submitted',
  },
  procurementSubmitConfirm: {
    zh: '确定要确认这张采购单吗？',
    en: 'Are you sure you want to submit this procurement order?',
  },
  procurementItemDataNotReady: {
    zh: '采购单明细数据尚未准备好',
    en: 'Procurement item data is not ready yet',
  },
  procurementItemNotFound: {
    zh: '未找到匹配的采购单明细',
    en: 'Cannot find matching procurement item',
  },
  procurementMissingItemId: {
    zh: '缺少采购单明细 ID',
    en: 'Missing procurement item id',
  },

  // ─── Material Module ───
  materialCreate: { zh: '新建原料', en: 'New Material' },
  materialFilterCategory: { zh: '按类别筛选：', en: 'Filter by Category:' },
  materialEditTitle: { zh: '编辑原料', en: 'Edit Material' },
  materialEditSuccess: { zh: '原料已更新', en: 'Material updated' },
  materialEditFailed: { zh: '更新原料失败', en: 'Failed to update material' },
  materialNameRequired: { zh: '请输入名称', en: 'Please input name' },
  materialNamePlaceholder: {
    zh: '输入原料名称',
    en: 'Input material name',
  },
  materialCategoryRequired: { zh: '请选择类别', en: 'Please select category' },
  materialCategoryPlaceholder: { zh: '选择类别', en: 'Select category' },
  materialYieldRateRequired: {
    zh: '请输入出成率',
    en: 'Please input yield rate',
  },
  materialYieldRatePlaceholder: { zh: '例如：0.8', en: 'e.g. 0.8' },
  materialSpecsRequired: { zh: '请输入加工规格', en: 'Please input specs' },
  materialSpecsPlaceholder: {
    zh: '例如：块、片、丝',
    en: 'e.g. chunk, slice, shred',
  },
  materialSpecsAtLeastOne: {
    zh: '请至少输入一个加工规格',
    en: 'Please input at least one spec',
  },
  materialAddRow: { zh: '新增一行', en: 'Add New Row' },
  materialSubmit: { zh: '提交', en: 'Submit' },
  materialCreateTitle: { zh: '新建原料', en: 'Add New Materials' },
  materialBreadcrumbCreate: { zh: '新建', en: 'Create' },
} as const;

export type TranslationKey = keyof typeof translations;
