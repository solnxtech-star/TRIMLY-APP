from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ( 
    RegisterBankDetailsView,
    InitializePaymentView, 
    PaymentWebhookView, 
    TransferWebhookView,
    RequestWithdrawalView,
    WalletAPIView,
    TransactionViewSet

)
router = DefaultRouter()
router.register("my-wallet-transactions/", TransactionViewSet, basename="transaction_history")

urlpatterns = router.urls + [
    path('create_subaccounts/', RegisterBankDetailsView.as_view(), name='sub-account'),
    path('initialize/', InitializePaymentView.as_view(), name='init-payment'),
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('withdraw/', RequestWithdrawalView.as_view(), name='withdraw-funds'),
    path('transfer-webhook/', TransferWebhookView.as_view(), name='transfer-webhook'),
    path("my-wallet/", WalletAPIView.as_view(),  name="wallets")
    
] 
