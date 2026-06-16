"use client";

import AssignBunchToRequestModal from "@/components/Master/assign_bunch/add";
import DirectAssignBunchToRequestModal from "@/components/Master/assign_bunch/direct_assign";
import AssignBoxOfficeCounter from "@/components/Master/box_office_counter/assign_counter";
import BoxOfficeAddCounterModal from "@/components/Master/box_office_counter/create";
import BoxOfficeEditCounterModal from "@/components/Master/box_office_counter/edit";
import CategoryModal from "@/components/Master/category";
import CategoryEditModal from "@/components/Master/category_edit";
import CinemaLocationAddFormModal from "@/components/Master/cinema_location/add";
import CinemaLocationEditFormModal from "@/components/Master/cinema_location/edit";
import FaqCategoryAddModal from "@/components/Master/faq_category/create";
import FaqCategoryEditModal from "@/components/Master/faq_category/edit";
import FoodComboAddModal from "@/components/Master/food_combo/add";
import FoodComboEditModal from "@/components/Master/food_combo/edit";
import FoodStoreCounterAddModal from "@/components/Master/food_counter/create";
import FoodStoreCounterEditModal from "@/components/Master/food_counter/edit";
import FoodItemAddModal from "@/components/Master/food_item/add";
import FoodItemEditModal from "@/components/Master/food_item/edit";
import FoodStoreAddModal from "@/components/Master/food_store/create";
import FoodStoreEditModal from "@/components/Master/food_store/edit";
import FoodTaxManageModal from "@/components/Master/food_tax_management/add";
import FoodTaxManageEditModal from "@/components/Master/food_tax_management/edit";
import FoodInventoryTransactionAddModal from "@/components/Master/food_transaction/add";
import FoodInventoryPurchaseEditModal from "@/components/Master/food_transaction/editPurchase";
import FoodInventoryPurchaseReturnModal from "@/components/Master/food_transaction/returnPurchase";
import FoodInventoryTransferReturnModal from "@/components/Master/food_transaction/returnTransfer";
import FreezeSeatModal from "@/components/Master/freeze_seats";
import LanguageModal from "@/components/Master/language";
import LanguageEditModal from "@/components/Master/language_edit";
import MovieTypeModal from "@/components/Master/movie_type";
import MovieTypeEditModal from "@/components/Master/movie_type_edit";
import PaymentMethodAddModal from "@/components/Master/payment_method/create";
import PaymentMethodEditModal from "@/components/Master/payment_method/edit";
import PermissionAddModal from "@/components/Master/permission/add";
import PermissionEditModal from "@/components/Master/permission/edit";
import QuotaTypeModal from "@/components/Master/quota_type";
import QuotaTypeEdit from "@/components/Master/quota_type_edit";
import AddRacipeModal from "@/components/Master/racipe_management/add";
import EditRecipeModal from "@/components/Master/racipe_management/edit";
import RatingModal from "@/components/Master/rating";
import RatingEditModal from "@/components/Master/rating_edit";
import FoodRawMaterialAddModal from "@/components/Master/raw_material/add";
import FoodRawMaterialEditModal from "@/components/Master/raw_material/edit";
import ServiceChargeAddModal from "@/components/Master/service_charge/add";
import ServiceChargeEditModal from "@/components/Master/service_charge/edit";
import ShowModal from "@/components/Master/show/create";
import ShowEditModal from "@/components/Master/show/edit";
import ShowClassModal from "@/components/Master/show_class/create";
import ShowClassEditModal from "@/components/Master/show_class/edit";
import StarCastAddForm from "@/components/Master/starcast/add";
import StarCastEditForm from "@/components/Master/starcast/edit";
import SupplierAddModal from "@/components/Master/supplier/add";
import SupplierEditModal from "@/components/Master/supplier/edit";
import TaxManageModal from "@/components/Master/tax_management/add";
import TaxManageEditModal from "@/components/Master/tax_management/edit";
import TaxModal from "@/components/Master/taxes/create";
import TaxEditModal from "@/components/Master/taxes/edit";
import UserAddFormModal from "@/components/Master/user/add";
import UserEditFormModal from "@/components/Master/user/edit";
import UserPasswordChangeModal from "@/components/Master/user/password_change";
import AddNewShowModal from "@/components/modal/AddNewShowModal";
import AssignCounterModal from "@/components/modal/box_office/assignCounterModal";
import CalculatedRawMaterialDataModal from "@/components/modal/calculatedRawMaterialDataModal";
import CancelShowModal from "@/components/modal/CancelShowModal";
import DistributerEditForm from "@/components/modal/DistributerEditForm";
import DistributorForm from "@/components/modal/DistributerForm";
import DistributerMovieDataModal from "@/components/modal/distributerMovieData";
import EditOfferForm from "@/components/modal/editOfferForm";
import EditSingleShowModal from "@/components/modal/EditSingleShowModal";
import EligibleOfferModal from "@/components/modal/eligibleOfferModal";
import FoodPaymentModalForm from "@/components/modal/food/paymentModal";
import AssignFoodStoreCounterModal from "@/components/modal/food_store/assignFoodStore";
import FoodOrderDataModal from "@/components/modal/foodOrderDetailModal";
import FoodOrderItemReturnModal from "@/components/modal/foodOrderItemReturnModal";
import LoyaltyEarningSettingEditModal from "@/components/modal/Loyalty/loyaltyEarningSettingEditModal";
import LoyaltyRedemptionSettingEditModal from "@/components/modal/Loyalty/loyaltyRedemptionSettingEditModal";
import MovieCollectionDetailModal from "@/components/modal/MovieCollectionDetailModal";
import MovieScheduleMovie from "@/components/modal/movieScheduleMovie";
import OfferForm from "@/components/modal/OfferForm";
import PaymentModalForm from "@/components/modal/paymentModal";
import PaymentSuccessModal from "@/components/modal/paymentSuccessModal";
import PurchasedItemDataModal from "@/components/modal/purchasedItemDataModal";
import RawMaterialDataModal from "@/components/modal/rawMaterialItemData";
import RequestedFoodItemDataModal from "@/components/modal/requestedFoodItemDataModal";
import RequestedFoodItemListModal from "@/components/modal/requestedFoodItemListModal";
import RequestedFoodTransferModal from "@/components/modal/RequestedFoodTransferModal";
import ScreenAssignModal from "@/components/modal/ScreenAssignModal";
import StoreDeviceListDataModal from "@/components/modal/storeDeviceListDataModal";
import TaxDataModal from "@/components/modal/taxDataModal";
import TicketDataModel from "@/components/modal/ticketDataModel";
import React from "react";
import { useSelector } from "react-redux";

const ModalInclude = () => {
  
    const { isScreenAssignVisible,isOpenMovieDataModal } = useSelector(
      (state) => state.assignMovie
    );

    const { 
      showFoodPaymentModalForm,
      showFoodRawMaterialModal,
      showFoodRawMaterialEditModal,
      showRacipeRawMaterialDataModal,
      showRacipeAddModal,
      showRacipeEditModal,
      showSupplierAddModal,
      showSupplierEditModal,
      showPurchaseItemModal,
      showRequestedFoodItemDataModal,
      showPurchaseReturnModal,
      showTransferReturnModal,
      showRequestedFoodItemListModal,
      showPurchaseEditModal,
        showEligibleOfferModal,
     } = useSelector((state) => state.foods);

    const { foodStoreAddShowModal,foodStoreEditShowModal,foodStoreAssignShowModal,foodStoreCounterAddShowModal ,foodStoreCounterEditShowModal} = useSelector((state) => state.food_store);

    const { boxOfficeCounterAddShowModal,boxOfficeCounterEditShowModal,boxOfficeCounterSelectionModal,boxOfficeCounterAssignShowModal } = useSelector((state) => state.box_office_counter);

    const {
      showOfferModalForm,
      showEditOfferModalForm,
      showModalForm,
      inventoryTransactionAddShowModal,
      showPaymentModalForm,
      showPaymentSuccessModal,
      showCancelShowModal,
      addNewShowModal,
      showModalEditForm,
      showAddRatingModal,
      showEditRatingModal,
      showAddCategoryModal,
      showEditCategoryModal,
      showAddQuotaTypeModal,
      showEditQuotaTypeModal,
      showAddMovieTypeModal,
      showEditMovieTypeModal,
      showAddLanguageModal,
      showEditLanguageModal,
      showAddShowModal,
      showEditShowModal,
      starCastAddShowModal,
      starCastEditShowModal,
      showClassAddShowModal,
      showClassEditShowModal,
      taxAddShowModal,
      taxEditShowModal,
      manageTaxAddShowModal,
      manageTaxEditShowModal,
      fooditemAddShowModal,
      manageFoodItemEditShowModal,
      serviceChargeAddShowModal,
      manageServiceChargeEditShowModal,
      foodcomboAddShowModal,
      manageFoodComboEditShowModal,
      permissionAddShowModal,
      managePermissionEditShowModal,
      manageFoodTaxAddShowModal,
      manageFoodTaxEditShowModal,
      userAddShowModal,
      manageUserEditShowModal,
      freezeSeatsModal,
      paymentMethodAddShowModal,
      paymentMethodEditShowModal,
      faqCategoryAddShowModal,
      faqCategoryEditShowModal,
      foodOrderShowModal,
      assignBunchShowModal,
      assignDirectBunchShowModal,
      taxDetailPopupModal,
      ticketDetailPopupModal,     
      distributerMovieListModal,
      selectedScreenShowForEdit,
      movieScheduleShowModal,
      cinemaLocationShowModal,
      cinemaLocationEditShowModal,
      manageUserPasswordChangeShowModal,
      previewRawMaterialShowModal,
      foodStoreDeviceShowModal,
      inventoryTransferTransactionAddShowModal,
      foodOrderForWastageShowModal,
    } = useSelector((state) => state.modal);

  return (
    <>
    {showModalForm && <DistributorForm />}
    {showOfferModalForm && <OfferForm />}
    {showEditOfferModalForm && <EditOfferForm />}
    {isScreenAssignVisible && <ScreenAssignModal />}
    {showPaymentModalForm && <PaymentModalForm />}
    {showPaymentSuccessModal && <PaymentSuccessModal />}
    {showFoodPaymentModalForm && <FoodPaymentModalForm />}
    {isOpenMovieDataModal && <MovieCollectionDetailModal />}
    {showCancelShowModal && <CancelShowModal />}
    {addNewShowModal && <AddNewShowModal />}
    {showModalEditForm && <DistributerEditForm />}
    {showAddRatingModal && <RatingModal />}
    {showEditRatingModal && <RatingEditModal />}
    {showAddCategoryModal && <CategoryModal />}
    {showEditCategoryModal && <CategoryEditModal />}
    {showAddQuotaTypeModal && <QuotaTypeModal />}
    {showEditQuotaTypeModal && <QuotaTypeEdit />}
    {showAddMovieTypeModal && <MovieTypeModal />}
    {showEditMovieTypeModal && <MovieTypeEditModal />}
    {showAddLanguageModal && <LanguageModal />} 
    {showEditLanguageModal && <LanguageEditModal />} 
    {showAddShowModal && <ShowModal/>} 
    {showEditShowModal && <ShowEditModal />} 
    {starCastAddShowModal && <StarCastAddForm />} 
    {starCastEditShowModal && <StarCastEditForm />} 
    {showClassAddShowModal && <ShowClassModal />} 
    {showClassEditShowModal && <ShowClassEditModal />} 

    {taxAddShowModal && <TaxModal />}
    {taxEditShowModal && <TaxEditModal />}
    {manageTaxAddShowModal && <TaxManageModal />}
    {manageTaxEditShowModal && <TaxManageEditModal />}
    {fooditemAddShowModal && <FoodItemAddModal />}
    {manageFoodItemEditShowModal && <FoodItemEditModal />}
    {serviceChargeAddShowModal && <ServiceChargeAddModal />}
    {manageServiceChargeEditShowModal && <ServiceChargeEditModal />}
    {foodcomboAddShowModal && <FoodComboAddModal />}
    {manageFoodComboEditShowModal && <FoodComboEditModal />}
    {permissionAddShowModal && <PermissionAddModal />}
    {managePermissionEditShowModal && <PermissionEditModal />}
    {manageFoodTaxAddShowModal && <FoodTaxManageModal />}
    {manageFoodTaxEditShowModal && <FoodTaxManageEditModal />}
    {userAddShowModal && <UserAddFormModal />}
    {manageUserEditShowModal && <UserEditFormModal />}
    {freezeSeatsModal && <FreezeSeatModal />}
    {paymentMethodAddShowModal && <PaymentMethodAddModal />}
    {paymentMethodEditShowModal && <PaymentMethodEditModal />}
    {faqCategoryAddShowModal && <FaqCategoryAddModal />}
    {faqCategoryEditShowModal && <FaqCategoryEditModal />}
    {foodOrderShowModal && <FoodOrderDataModal />}
    {assignBunchShowModal && <AssignBunchToRequestModal />}
    {assignDirectBunchShowModal && <DirectAssignBunchToRequestModal />}
    {taxDetailPopupModal && <TaxDataModal />}
    {ticketDetailPopupModal && <TicketDataModel />}
    {boxOfficeCounterAddShowModal && <BoxOfficeAddCounterModal />}
    {boxOfficeCounterEditShowModal && <BoxOfficeEditCounterModal />}
    {boxOfficeCounterSelectionModal && <AssignBoxOfficeCounter />}
    {foodStoreAddShowModal && <FoodStoreAddModal />}
    {foodStoreEditShowModal && <FoodStoreEditModal />}
    {showFoodRawMaterialModal && <FoodRawMaterialAddModal />}
    {showFoodRawMaterialEditModal && <FoodRawMaterialEditModal />}
    {showRacipeRawMaterialDataModal && <RawMaterialDataModal />}
    {showRacipeAddModal && <AddRacipeModal />}
    {showRacipeEditModal && <EditRecipeModal />}
    {showSupplierAddModal && <SupplierAddModal />}
    {showSupplierEditModal && <SupplierEditModal />}
    {distributerMovieListModal && <DistributerMovieDataModal />}
    {selectedScreenShowForEdit && <EditSingleShowModal />}
    {movieScheduleShowModal && <MovieScheduleMovie />}
    {cinemaLocationShowModal && <CinemaLocationAddFormModal />}
    {cinemaLocationEditShowModal && <CinemaLocationEditFormModal />}
    {manageUserPasswordChangeShowModal && <UserPasswordChangeModal />}

    {inventoryTransferTransactionAddShowModal && <RequestedFoodTransferModal />}      
    {inventoryTransactionAddShowModal && <FoodInventoryTransactionAddModal />}      
    {showPurchaseItemModal && <PurchasedItemDataModal />}      
    {previewRawMaterialShowModal && <CalculatedRawMaterialDataModal />}      
    {foodStoreDeviceShowModal && <StoreDeviceListDataModal />}      
    {showRequestedFoodItemDataModal && <RequestedFoodItemDataModal />}      
    {showPurchaseReturnModal && <FoodInventoryPurchaseReturnModal />}      
    {boxOfficeCounterAssignShowModal && <AssignCounterModal />}
    {foodStoreAssignShowModal && <AssignFoodStoreCounterModal />}
    {showTransferReturnModal && <FoodInventoryTransferReturnModal />}
    {showRequestedFoodItemListModal && <RequestedFoodItemListModal />}

        {foodStoreCounterAddShowModal && <FoodStoreCounterAddModal />}
        {foodStoreCounterEditShowModal && <FoodStoreCounterEditModal />}
        {foodOrderForWastageShowModal && <FoodOrderItemReturnModal />}
        {showPurchaseEditModal && <FoodInventoryPurchaseEditModal />}
        {showEligibleOfferModal && <EligibleOfferModal />}

        <LoyaltyEarningSettingEditModal />
        <LoyaltyRedemptionSettingEditModal />
    
    </>
  );
};

export default ModalInclude;