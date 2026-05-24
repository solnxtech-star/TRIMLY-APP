from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ( 
    GetBankListAPIView,
    RegisterBankDetailsView,
    InitializePaymentView, 
    PaymentWebhookView,
    SaveBankDetailsView, 
    TransferWebhookView,
    RequestWithdrawalView,
    WalletAPIView,
    TransactionViewSet,
    PaymentVerificationView

)
router = DefaultRouter()
router.register("my-wallet-transactions", TransactionViewSet, basename="transaction_history")

urlpatterns = router.urls + [
    path("banks-list/", GetBankListAPIView.as_view(), name="banks_list"),
    path("save-bank-details/", SaveBankDetailsView.as_view(), name="save_bank_details"),
    path('initialize/', InitializePaymentView.as_view(), name='init-payment'),
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('withdraw/', RequestWithdrawalView.as_view(), name='withdraw-funds'),
    path('transfer-webhook/', TransferWebhookView.as_view(), name='transfer-webhook'),
    path("my-wallet/", WalletAPIView.as_view(),  name="wallets"),
    path("payment_verification/", PaymentVerificationView.as_view(),  name="payment_Verification")
    
] 
